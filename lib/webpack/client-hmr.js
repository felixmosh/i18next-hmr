module.exports = function applyClientHMR(i18nOrGetter) {
  if (module.hot) {
    const { extractList, printList, reloadTranslations, log } = require('../utils');
    const { changedFile } = require('./trigger.js');

    if (!changedFile || changedFile) {
      // We must use the required variable
      log('Client HMR has started');
    }

    module.hot.accept('./trigger.js', () => {
      const { changedFiles } = require('./trigger.js');
      const i18nInstance =
        typeof i18nOrGetter === 'function' ? i18nOrGetter({ changedFiles }) : i18nOrGetter;

      const list = extractList(changedFiles, i18nInstance);

      if (!list.length) {
        return;
      }

      log(`Got an update with ${printList(list)}`);

      return reloadTranslations(list, i18nInstance);
    });
  }
};
