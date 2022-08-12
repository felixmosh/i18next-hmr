const { extractList, printList, uniqueList, createLoggerOnce } = require('./utils');

module.exports = function applyClientHMR(i18nOrGetter) {
  if (module.hot) {
    function log(msg, type = 'log') {
      console[type](`[%cI18NextHMR%c] ${msg}`, 'color:#bc93b6', '');
    }

    const logOnce = createLoggerOnce(log);

    const { changedFile } = require('./trigger.js');

    if (!changedFile || changedFile) {
      // We must use the required variable
      log('Client HMR has started');
    }

    async function reloadTranslations(list, i18nInstance) {
      let backendOptions = { queryStringParams: {} };
      try {
        backendOptions =
          i18nInstance.options.backend || i18nInstance.services.backendConnector.backend.options;
        backendOptions.queryStringParams = backendOptions.queryStringParams || {};
      } catch (e) {
        logOnce('Client i18next-http-backend not found, hmr may not work', 'warn');
      }

      backendOptions.queryStringParams._ = new Date().getTime(); // cache killer

      const langs = uniqueList(list.map((item) => item.lang));
      const namespaces = uniqueList(list.map((item) => item.ns));

      await i18nInstance.reloadResources(langs, namespaces, (error) => {
        if (error) {
          log(error, 'error');
          return;
        }

        const currentLang = i18nInstance.language;

        if (langs.includes(currentLang)) {
          i18nInstance.changeLanguage(currentLang);
          log(`Update applied successfully`);
        } else {
          log(`Resources of '${printList(list)}' were reloaded successfully`);
        }
      });
    }

    module.hot.accept('./trigger.js', () => {
      const { changedFiles } = require('./trigger.js');
      const i18nInstance = typeof i18nOrGetter === 'function' ? i18nOrGetter() : i18nOrGetter;

      const list = extractList(changedFiles, i18nInstance);

      if (!list.length) {
        return;
      }

      log(`Got an update with ${printList(list)}`);

      return reloadTranslations(list, i18nInstance);
    });
  }
};
