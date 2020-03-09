module.exports = function applyClientHMR(i18n) {
  if (module.hot) {
    function log(msg, type = 'log') {
      console[type](`[%cI18NextHMR%c] ${msg}`, 'color:#bc93b6', '');
    }

    const { lang } = require('./trigger.js');

    if (!lang || lang) {
      // We must use the required variable
      log('Client HMR has started');
    }

    let backendOptions = { queryStringParams: {} };
    try {
      backendOptions = i18n.options.backend || i18n.services.backendConnector.backend.options;
      backendOptions.queryStringParams = backendOptions.queryStringParams || {};
    } catch (e) {
      log('Client i18next-backend not found, hmr may not work', 'warn');
    }

    async function reloadTranslations(lang, ns) {
      backendOptions.queryStringParams._ = new Date().getTime(); // cache killer

      await i18n.reloadResources([lang], [ns], error => {
        if (error) {
          log(error, 'error');
          return;
        }

        const currentLang = i18n.services.languageUtils.getLanguagePartFromCode(i18n.language);
        if (currentLang === lang) {
          i18n.changeLanguage(lang);
          log(`Update applied successfully`);
        } else {
          log(`Resources of '${lang}' were reloaded successfully`);
        }
      });
    }

    module.hot.accept('./trigger.js', () => {
      const { lang, ns } = require('./trigger.js');
      log(`Got an update with '${lang}', '${ns}'`);

      return reloadTranslations(lang, ns);
    });
  }
};
