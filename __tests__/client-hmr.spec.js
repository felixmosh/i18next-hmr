let changedData = {};
jest.mock('../lib/trigger.js', () => {
  return changedData;
});

global.mockModule = {
  hot: {
    accept: jest.fn(),
  },
};

const applyClientHMR = require('../lib/client-hmr');

function whenHotTriggeredWith(changedFile) {
  changedData.changedFile = changedFile;

  const acceptCallback = mockModule.hot.accept.mock.calls[0][1];
  return acceptCallback();
}

describe('client-hmr', () => {
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
      services: {
        languageUtils: {
          getLanguagePartFromCode: code => code.split('-')[0],
        },
      },
      changeLanguage: jest.fn(),
    };

    mockModule.hot.accept.mockReset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should warn regarding missing backend options', () => {
    spyOn(global.console, 'warn').and.callThrough();
    applyClientHMR(i18nMock);
    expect(global.console.warn).toHaveBeenCalledWith(
      expect.stringContaining('i18next-backend not found'),
      expect.any(String),
    );
  });

  it('should use backend options from global options as cache killer param', () => {
    i18nMock.options = { backend: {}, ns: ['name-space'] };
    i18nMock.language = 'en';

    applyClientHMR(i18nMock);

    whenHotTriggeredWith('en/name-space');

    expect(i18nMock.options.backend).toHaveProperty('queryStringParams', { _: expect.any(Number) });
  });

  it('should use backend options from services as cache killer param', () => {
    i18nMock.services = {
      ...i18nMock.services,
      backendConnector: { backend: { options: {} } },
    };
    i18nMock.language = 'en';
    i18nMock.options = { ns: ['name-space'] };

    applyClientHMR(i18nMock);

    whenHotTriggeredWith('en/name-space');

    expect(i18nMock.services.backendConnector.backend.options).toHaveProperty('queryStringParams', {
      _: expect.any(Number),
    });
  });

  it('should trigger reload when translation file changed', async () => {
    i18nMock.options = { backend: {}, ns: ['name-space'] };
    i18nMock.language = 'en';

    applyClientHMR(i18nMock);

    await whenHotTriggeredWith('en/name-space');

    expect(i18nMock.reloadResources).toHaveBeenCalledWith(
      ['en'],
      ['name-space'],
      expect.any(Function)
    );
    expect(i18nMock.changeLanguage).toHaveBeenCalledWith('en');
  });

  it('should trigger reload when translation file changed with nested namespace', async () => {
    i18nMock.options = { backend: {}, ns: ['name-space', 'nested/name-space'] };
    i18nMock.language = 'en';

    applyClientHMR(i18nMock);

    await whenHotTriggeredWith('en/nested/name-space');

    expect(i18nMock.reloadResources).toHaveBeenCalledWith(
      ['en'],
      ['nested/name-space'],
      expect.any(Function)
    );
    expect(i18nMock.changeLanguage).toHaveBeenCalledWith('en');
  });

  it('should not trigger changeLanguage when current lang is not the one that was edited', async () => {
    i18nMock.options = { backend: {}, ns: ['name-space'] };
    i18nMock.language = 'en';

    applyClientHMR(i18nMock);

    await whenHotTriggeredWith('otherLang/name-space');

    expect(i18nMock.reloadResources).toHaveBeenCalledWith(
      ['otherLang'],
      ['name-space'],
      expect.any(Function)
    );
    expect(i18nMock.changeLanguage).not.toHaveBeenCalled();
  });

  it('should notify that reload resource failed', async () => {
    spyOn(global.console, 'error').and.callThrough();
    i18nMock.options = { backend: {}, ns: ['name-space'] };
    i18nMock.language = 'en';
    reloadError = 'reload failed';

    applyClientHMR(i18nMock);
    await whenHotTriggeredWith('en/name-space');

    expect(i18nMock.changeLanguage).not.toHaveBeenCalled();
    expect(global.console.error).toHaveBeenCalledWith(
      expect.stringContaining(reloadError),
      expect.any(String),
    );
  });

  it('should ignore changes of none loaded namespace', async () => {
    spyOn(global.console, 'log').and.callThrough();
    i18nMock.options = { backend: {}, ns: ['name-space'] };
    i18nMock.language = 'en';

    applyClientHMR(i18nMock);

    await whenHotTriggeredWith('en/none-loaded-ns');

    expect(global.console.log).not.toHaveBeenCalledWith(
      expect.stringContaining('Got an update with'),
      expect.any(String)
    );
    expect(i18nMock.reloadResources).not.toHaveBeenCalled();
    expect(i18nMock.changeLanguage).not.toHaveBeenCalled();
  });

  it('should distinguish containing namespaces names', async () => {
    spyOn(global.console, 'log').and.callThrough();
    i18nMock.options = { backend: {}, ns: ['name-space'] };
    i18nMock.language = 'en';

    applyClientHMR(i18nMock);

    await whenHotTriggeredWith('en/none-loaded-name-space');

    expect(global.console.log).not.toHaveBeenCalledWith(
      expect.stringContaining('Got an update with'),
      expect.any(String),
    );
    expect(i18nMock.reloadResources).not.toHaveBeenCalled();
    expect(i18nMock.changeLanguage).not.toHaveBeenCalled();
  });
});
