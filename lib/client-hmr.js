const { extractLangAndNS, printList } = require('./utils');

module.exports = function applyClientHMR(i18n) {
  if (module.hot) {
    function log(msg, type = 'log') {
      console[type](`[%cI18NextHMR%c] ${msg}`, 'color:#bc93b6', '');
    }

    const { changedFile } = require('./trigger.js');

    if (!changedFile || changedFile) {
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

    async function reloadTranslations(list) {
      backendOptions.queryStringParams._ = new Date().getTime(); // cache killer
      const langs = [...new Set(list.map((item) => item.lang))];
      const namespaces = [...new Set(list.map((item) => item.ns))];

      await i18n.reloadResources(langs, namespaces, (error) => {
        if (error) {
          log(error, 'error');
          return;
        }

        const currentLang = i18n.language;

        if (langs.includes(currentLang)) {
          i18n.changeLanguage(currentLang);
          log(`Update applied successfully`);
        } else {
          log(`Resources of '${printList(list)}' were reloaded successfully`);
        }
      });
    }

    module.hot.accept('./trigger.js', () => {
      const { changedFiles } = require('./trigger.js');
      const currentNSList = Object.keys(i18n.store.data[i18n.language])

      const list = changedFiles
        .map((changedFile) => extractLangAndNS(changedFile, currentNSList))
        .filter(({ lang, ns }) => Boolean(lang) && Boolean(ns));

      if (!list.length) {
        return;
      }

      log(`Got an update with ${printList(list)}`);

      return reloadTranslations(list);
    });
  }
};
