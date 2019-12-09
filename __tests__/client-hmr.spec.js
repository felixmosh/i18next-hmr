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

function whenHotTriggeredWith(lang, ns) {
  changedData.lang = lang;
  changedData.ns = ns;

  const acceptCallback = mockModule.hot.accept.mock.calls[0][1];
  return acceptCallback();
}

describe('client-hmr', () => {
  let i18nMock;
  beforeEach(() => {
    i18nMock = {
      reloadResources: jest.fn(),
      changeLanguage: jest.fn(),
    };

    mockModule.hot.accept.mockReset();
  });

  it('should warn regarding missing backend options', () => {
    spyOn(global.console, 'warn').and.callThrough();
    applyClientHMR(i18nMock);
    expect(global.console.warn).toHaveBeenCalledWith(
      expect.stringContaining('i18next-backend not found'),
      expect.any(String),
      expect.any(String)
    );
  });

  it('should it should use backend options from global options as cache killer param', () => {
    i18nMock.options = { backend: {} };
    i18nMock.language = 'en';

    applyClientHMR(i18nMock);

    whenHotTriggeredWith('en', 'ns');

    expect(i18nMock.options.backend).toHaveProperty('queryStringParams', { _: expect.any(Number) });
  });

  it('should it should use backend options from services as cache killer param', () => {
    i18nMock.services = {
      backendConnector: { backend: { options: {} } },
    };
    i18nMock.language = 'en';
    i18nMock.options = {};

    applyClientHMR(i18nMock);

    whenHotTriggeredWith('en', 'ns');

    expect(i18nMock.services.backendConnector.backend.options).toHaveProperty('queryStringParams', {
      _: expect.any(Number),
    });
  });

  it('should trigger reload when translation file changed', async () => {
    i18nMock.options = { backend: {} };
    i18nMock.language = 'en';

    applyClientHMR(i18nMock);

    await whenHotTriggeredWith('en', 'ns');

    expect(i18nMock.reloadResources).toHaveBeenCalledWith(['en'], ['ns']);
    expect(i18nMock.changeLanguage).toHaveBeenCalledWith('en');
  });

  it('should not trigger reloads when current lang is not the one that was edited', async () => {
    i18nMock.options = { backend: {} };
    i18nMock.language = 'en';

    applyClientHMR(i18nMock);

    await whenHotTriggeredWith('otherLang', 'ns');

    expect(i18nMock.reloadResources).not.toHaveBeenCalled();
    expect(i18nMock.changeLanguage).not.toHaveBeenCalled();
  });
});
