export function applyViteClientHMR(i18nOrGetter, options = {}) {
  if (import.meta.hot) {
    const { extractList, printList, reloadTranslations, createLogger } = require('../utils');
    const logger = createLogger(options);

    logger.log('Client HMR has started');

    import.meta.hot.on('i18next-hmr:locale-changed', ({ changedFiles }) => {
      const i18nInstance =
        typeof i18nOrGetter === 'function' ? i18nOrGetter({ changedFiles }) : i18nOrGetter;

      const list = extractList(changedFiles, i18nInstance);

      if (!list.length) {
        return;
      }

      logger.log(`Got an update with ${printList(list)}`);

      return reloadTranslations(list, i18nInstance, logger);
    });
  }
}
