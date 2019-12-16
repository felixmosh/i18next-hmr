const applyServerHMR = require('../lib/server-hmr');
const plugin = require('../lib/plugin');

describe('server-hmr', () => {
  let i18nMock;
  let reloadError;

  beforeEach(() => {
    reloadError = undefined;

    i18nMock = {
      reloadResources: jest.fn().mockImplementation((_lang, _ns, callbackFn) => {
        if (typeof callbackFn === 'function') {
          callbackFn(reloadError);
        }
        return Promise.resolve();
      }),
    };
    jest.spyOn(plugin, 'addListener');
  });

  beforeEach(() => {
    applyServerHMR(i18nMock);
  });

  it('should register a listener on webpack plugin', () => {
    expect(plugin.addListener).toHaveBeenCalled();
  });

  it('should reload resources on updated lang, ns', () => {
    const update = { lang: 'en', ns: 'name-space' };
    plugin.callbacks[0](update);
    expect(i18nMock.reloadResources).toHaveBeenCalledWith([update.lang], [update.ns]);
  });

  it('should notify on successful change', async () => {
    spyOn(global.console, 'log').and.callThrough();

    await plugin.callbacks[0]({ lang: 'en', ns: 'ns' });

    expect(global.console.log).toHaveBeenCalledWith(
      expect.stringContaining('Server reloaded locale')
    );
  });

  it('should notify when reload fails', async () => {
    reloadError = 'reload failed';

    spyOn(global.console, 'log').and.callThrough();

    await plugin.callbacks[0]({ lang: 'en', ns: 'ns' });

    expect(global.console.log).toHaveBeenCalledWith(expect.stringContaining(reloadError));
  });
});
