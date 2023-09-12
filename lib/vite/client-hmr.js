const { extractList, printList, reloadTranslations, log } = require('../utils');

export function applyViteClientHMR(i18nOrGetter) {
  if (import.meta.hot) {
    log('Client HMR has started');

    import.meta.hot.on('i18next-hmr:locale-changed', ({ changedFiles }) => {
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
}
