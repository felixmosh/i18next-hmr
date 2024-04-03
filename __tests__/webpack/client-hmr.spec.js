let changedData = {};
jest.mock('../../lib/webpack/trigger.js', () => {
  return changedData;
});

global.mockModule = {
  hot: {
    accept: jest.fn(),
  },
};

const applyClientHMR = require('../../lib/webpack/client-hmr');

function whenHotTriggeredWith(changedFiles) {
  changedData.changedFiles = changedFiles;

  const acceptCallback = mockModule.hot.accept.mock.calls[0][1];
  return acceptCallback();
}

describe('Webpack - client-hmr', () => {
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
      changeLanguage: jest.fn(),
      languages: ['en', 'de', 'en-US'],
    };

    mockModule.hot.accept.mockReset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should warn regarding missing backend options once', () => {
    jest.spyOn(global.console, 'warn');
    i18nMock.options = { ns: ['name-space'] };

    applyClientHMR(i18nMock);
    whenHotTriggeredWith(['en/name-space']);

    expect(global.console.warn).toHaveBeenCalledTimes(1);
    expect(global.console.warn).toHaveBeenCalledWith(
      expect.stringContaining('i18next-http-backend not found'),
      expect.any(String),
      expect.any(String)
    );
  });

  it('should use backendConnector options from services as cache killer param', () => {
    i18nMock.services = {
      ...i18nMock.services,
      backendConnector: { backend: { options: {} } },
    };
    i18nMock.language = 'en';
    i18nMock.options = { ns: ['name-space'] };

    applyClientHMR(i18nMock);

    whenHotTriggeredWith(['en/name-space']);

    expect(i18nMock.services.backendConnector.backend.options).toHaveProperty('queryStringParams', {
      _: expect.any(Number),
    });
  });

  it('should trigger reload when translation file changed', async () => {
    i18nMock.options = { backend: {}, ns: ['name-space'] };
    i18nMock.language = 'en';

    applyClientHMR(i18nMock);

    await whenHotTriggeredWith(['en/name-space']);

    expect(i18nMock.reloadResources).toHaveBeenCalledWith(
      ['en'],
      ['name-space'],
      expect.any(Function)
    );
    expect(i18nMock.changeLanguage).toHaveBeenCalledWith('en');
  });

  it('should trigger reload when i18n given as a getter function', async () => {
    i18nMock.options = { backend: {}, ns: ['name-space'] };
    i18nMock.language = 'en';

    applyClientHMR(() => i18nMock);

    await whenHotTriggeredWith(['en/name-space']);

    expect(i18nMock.reloadResources).toHaveBeenCalledWith(
      ['en'],
      ['name-space'],
      expect.any(Function)
    );
    expect(i18nMock.changeLanguage).toHaveBeenCalledWith('en');
  });

  it('should pass changed filed to the i18next getter', () => {
    i18nMock.options = { backend: {}, ns: ['name-space'] };
    i18nMock.language = 'en';
    const getter = jest.fn().mockImplementation(() => i18nMock);
    const changedFiles = ['en/name-space'];

    applyClientHMR(getter);
    whenHotTriggeredWith(changedFiles);

    expect(getter).toHaveBeenCalledWith({ changedFiles });
  });

  it('should trigger reload when lng-country combination file changed', () => {
    i18nMock.options = { backend: {}, ns: ['name-space'] };
    i18nMock.language = 'en-US';

    applyClientHMR(i18nMock);

    whenHotTriggeredWith(['en-US/name-space']);

    expect(i18nMock.reloadResources).toHaveBeenCalledWith(
      ['en-US'],
      ['name-space'],
      expect.any(Function)
    );
    expect(i18nMock.changeLanguage).toHaveBeenCalledWith('en-US');
  });

  it('should trigger reload when translation file changed with nested namespace', async () => {
    i18nMock.options = { backend: {}, ns: ['name-space', 'nested/name-space'] };
    i18nMock.language = 'en';

    applyClientHMR(i18nMock);

    await whenHotTriggeredWith(['en/nested/name-space']);

    expect(i18nMock.reloadResources).toHaveBeenCalledWith(
      ['en'],
      ['nested/name-space'],
      expect.any(Function)
    );
    expect(i18nMock.changeLanguage).toHaveBeenCalledWith('en');
  });

  it('should trigger reload when translation file with backslashes (windows)', async () => {
    i18nMock.options = { backend: {}, ns: ['name-space', 'nested/name-space'] };
    i18nMock.language = 'en';

    applyClientHMR(i18nMock);

    await whenHotTriggeredWith(['en\\nested\\name-space']);

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
    i18nMock.languages.push('otherLang');

    applyClientHMR(i18nMock);

    await whenHotTriggeredWith(['otherLang/name-space']);

    expect(i18nMock.reloadResources).toHaveBeenCalledWith(
      ['otherLang'],
      ['name-space'],
      expect.any(Function)
    );
    expect(i18nMock.changeLanguage).not.toHaveBeenCalled();
  });

  it('should notify that reload resource failed', async () => {
    jest.spyOn(global.console, 'error');
    i18nMock.options = { backend: {}, ns: ['name-space'] };
    i18nMock.language = 'en';
    reloadError = 'reload failed';

    applyClientHMR(i18nMock);
    await whenHotTriggeredWith(['en/name-space']);

    expect(i18nMock.changeLanguage).not.toHaveBeenCalled();
    expect(global.console.error).toHaveBeenCalledWith(
      expect.stringContaining(reloadError),
      expect.any(String),
      expect.any(String)
    );
  });

  it('should ignore changes of none loaded namespace', async () => {
    jest.spyOn(global.console, 'log');
    i18nMock.options = { backend: {}, ns: ['name-space'] };
    i18nMock.language = 'en';

    applyClientHMR(i18nMock);

    await whenHotTriggeredWith(['en/none-loaded-ns']);

    expect(global.console.log).not.toHaveBeenCalledWith(
      expect.stringContaining('Got an update with'),
      expect.any(String)
    );
    expect(i18nMock.reloadResources).not.toHaveBeenCalled();
    expect(i18nMock.changeLanguage).not.toHaveBeenCalled();
  });

  it('should distinguish containing namespaces names', async () => {
    jest.spyOn(global.console, 'log');
    i18nMock.options = { backend: {}, ns: ['name-space'] };
    i18nMock.language = 'en';

    applyClientHMR(i18nMock);

    await whenHotTriggeredWith(['en/none-loaded-name-space']);

    expect(global.console.log).not.toHaveBeenCalledWith(
      expect.stringContaining('Got an update with'),
      expect.any(String)
    );
    expect(i18nMock.reloadResources).not.toHaveBeenCalled();
    expect(i18nMock.changeLanguage).not.toHaveBeenCalled();
  });

  it('should support fallbackNS as optional ns', async () => {
    i18nMock.options = {
      backend: {},
      ns: ['nested/name-space'],
      fallbackNS: ['nested/fallback-name-space'],
    };
    i18nMock.language = 'en-US';

    applyClientHMR(i18nMock);

    await whenHotTriggeredWith(['nested/fallback-name-space/en-US']);

    expect(i18nMock.reloadResources).toHaveBeenCalledWith(
      ['en-US'],
      ['nested/fallback-name-space'],
      expect.any(Function)
    );
    expect(i18nMock.changeLanguage).toHaveBeenCalledWith('en-US');
  });

  it('should support defaultNS as optional ns', async () => {
    i18nMock.options = {
      backend: {},
      ns: [],
      defaultNS: ['common'],
    };
    i18nMock.language = 'en-US';

    applyClientHMR(i18nMock);

    await whenHotTriggeredWith(['common/en-US']);

    expect(i18nMock.reloadResources).toHaveBeenCalledWith(
      ['en-US'],
      ['common'],
      expect.any(Function)
    );
    expect(i18nMock.changeLanguage).toHaveBeenCalledWith('en-US');
  });

  it('should support complex localePath {{ns}}/locales/{{lng}}.json', async () => {
    i18nMock.options = { backend: {}, ns: ['nested/name-space'] };
    i18nMock.language = 'en-US';

    applyClientHMR(i18nMock);

    await whenHotTriggeredWith(['nested/name-space/locales/en-US']);

    expect(i18nMock.reloadResources).toHaveBeenCalledWith(
      ['en-US'],
      ['nested/name-space'],
      expect.any(Function)
    );
    expect(i18nMock.changeLanguage).toHaveBeenCalledWith('en-US');
  });

  it('should support options.supportedLngs as a language source', async () => {
    i18nMock.options = {
      backend: {},
      ns: ['nested/name-space'],
      fallbackNS: ['nested/fallback-name-space'],
      supportedLngs: ['en-US'],
    };
    i18nMock.language = 'en-US';
    i18nMock.languages = [];

    applyClientHMR(i18nMock);

    await whenHotTriggeredWith(['nested/fallback-name-space/en-US']);

    expect(i18nMock.reloadResources).toHaveBeenCalledWith(
      ['en-US'],
      ['nested/fallback-name-space'],
      expect.any(Function)
    );
    expect(i18nMock.changeLanguage).toHaveBeenCalledWith('en-US');
  });

  it('should support options.lng as a language source', async () => {
    i18nMock.options = {
      backend: {},
      ns: ['nested/name-space'],
      fallbackNS: ['nested/fallback-name-space'],
      lng: 'en-US',
    };
    i18nMock.language = 'en-US';
    i18nMock.languages = [];

    applyClientHMR(i18nMock);

    await whenHotTriggeredWith(['nested/fallback-name-space/en-US']);

    expect(i18nMock.reloadResources).toHaveBeenCalledWith(
      ['en-US'],
      ['nested/fallback-name-space'],
      expect.any(Function)
    );
    expect(i18nMock.changeLanguage).toHaveBeenCalledWith('en-US');
  });

  it('should support options.fallbackLng as a language source', async () => {
    i18nMock.options = {
      backend: {},
      ns: ['nested/name-space'],
      fallbackNS: ['nested/fallback-name-space'],
      fallbackLng: 'en-US',
    };
    i18nMock.language = 'en-US';
    i18nMock.languages = [];

    applyClientHMR(i18nMock);

    await whenHotTriggeredWith(['nested/fallback-name-space/en-US']);

    expect(i18nMock.reloadResources).toHaveBeenCalledWith(
      ['en-US'],
      ['nested/fallback-name-space'],
      expect.any(Function)
    );
    expect(i18nMock.changeLanguage).toHaveBeenCalledWith('en-US');
  });

  describe('multiple files', () => {
    it('should support change of multiple files', async () => {
      i18nMock.options = { backend: {}, ns: ['name-space', 'name-space2'] };
      i18nMock.language = 'en';

      applyClientHMR(i18nMock);

      await whenHotTriggeredWith(['en/name-space', 'en/name-space2', 'de/name-space']);

      expect(i18nMock.reloadResources).toHaveBeenCalledWith(
        ['en', 'de'],
        ['name-space', 'name-space2'],
        expect.any(Function)
      );
      expect(i18nMock.changeLanguage).toHaveBeenCalled();
    });

    it('should not trigger `changeLanguage` when modified files are not related to the current language', async () => {
      i18nMock.options = { backend: {}, ns: ['name-space', 'name-space2'] };
      i18nMock.language = 'en';

      applyClientHMR(i18nMock);

      await whenHotTriggeredWith(['de/name-space', 'de/name-space2']);

      expect(i18nMock.changeLanguage).not.toHaveBeenCalled();
    });
  });
});
