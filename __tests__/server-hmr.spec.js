const applyServerHMR = require('../lib/server-hmr');
const plugin = require('../lib/plugin');

describe('server-hmr', () => {
  const i18nMock = {
    reloadResources: jest.fn(),
  };

  beforeEach(() => {
    jest.spyOn(plugin, 'addListener');
  });

  it('should register a listener on webpack plugin', () => {
    applyServerHMR(i18nMock);
    expect(plugin.addListener).toHaveBeenCalled();
  });

  it('should reload resources on updated lang, ns', () => {
    applyServerHMR(i18nMock);
    const update = { lang: 'en', ns: 'name-space' };
    plugin.callbacks[0](update);
    expect(i18nMock.reloadResources).toHaveBeenCalledWith([update.lang], [update.ns]);
  });
});
