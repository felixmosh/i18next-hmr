const { extractList, printList, uniqueList, createLoggerOnce } = require('../utils');

module.exports = function applyServerHMR(i18nOrGetter) {
  const pluginName = `\x1b[35m\x1b[1m${'I18NextHMR'}\x1b[0m\x1b[39m`;
  function log(message, type = 'log') {
    console[type](`[ ${pluginName} ] ${message}`);
  }

  const logOnce = createLoggerOnce(log);

  function reloadServerTranslation({ changedFiles }) {
    const i18nInstance =
      typeof i18nOrGetter === 'function' ? i18nOrGetter({ changedFiles }) : i18nOrGetter;

    if (!i18nInstance) {
      return;
    }

    const list = extractList(changedFiles, i18nInstance);

    if (list.length === 0) {
      return;
    }

    log(`Got an update with ${printList(list)}`);

    const langs = uniqueList(list.map((item) => item.lang));
    const namespaces = uniqueList(list.map((item) => item.ns));

    i18nInstance.reloadResources(langs, namespaces, (error) => {
      if (error) {
        log(`\x1b[31m\x1b[1m${error}\x1b[0m\x1b[39m`);
      } else {
        log(`Server reloaded locale of ${printList(list)} successfully`);
      }
    });
  }

  if (module.hot) {
    const { changedFile } = require('./trigger.js');

    if (!changedFile || changedFile) {
      // We must use the required variable
      logOnce(`Server HMR has started`);
    }

    module.hot.accept('./trigger.js', () => {
      const changedFiles = require('./trigger.js');
      reloadServerTranslation(changedFiles);
    });
  } else {
    logOnce(`Server HMR has started - callback mode`);

    const HMRPlugin = require('./plugin').I18NextHMRPlugin;
    HMRPlugin.addListener(reloadServerTranslation);
  }
};
