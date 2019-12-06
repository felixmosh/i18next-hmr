module.exports = function applyClientHMR(i18n) {
  if (module.hot) {
    const { lang } = require('./trigger.js');

    if (!lang || lang) { // We must use the required variable
      console.log('[I18NextHMR] Client HMR has started');
    }

    i18n.options.backend = i18n.options.backend || {};
    i18n.options.backend.queryStringParams = i18n.options.backend.queryStringParams || {};

    async function reloadTranslations(lang, ns) {
      i18n.options.backend.queryStringParams._ = new Date().getTime();
      await i18n.reloadResources([lang], [ns]);
      i18n.changeLanguage(lang);
      console.log(`[I18NextHMR] Update applied successfully`);
    }

    module.hot.accept('./trigger.js', () => {
      const { lang, ns } = require('./trigger.js');
      console.log(`[I18NextHMR] Got an update for locale of lang: '${lang}', namespace: '${ns}'`);

      if (i18n.language === lang) {
        return reloadTranslations(lang, ns);
      }
    });
  }
};
