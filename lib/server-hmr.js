const { extractLangAndNS, printList } = require('./utils');

module.exports = function applyServerHMR(i18n) {
  const pluginName = `\x1b[35m\x1b[1m${'I18NextHMR'}\x1b[0m\x1b[39m`;

  function log(message) {
    console.log(`[ ${pluginName} ] ${message}`);
  }

  function reloadServerTranslation({ changedFiles }) {
    const list = changedFiles
      .map((changedFile) => extractLangAndNS(changedFile, i18n.options.ns))
      .filter(({ lang, ns }) => Boolean(lang) && Boolean(ns));

    if (list.length === 0) {
      return;
    }

    log(`Got an update with ${printList(list)}`);

    const langs = [...new Set(list.map((item) => item.lang))];
    const namespaces = [...new Set(list.map((item) => item.ns))];

    i18n.reloadResources(langs, namespaces, (error) => {
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
      log(`Server HMR has started`);
    }

    module.hot.accept('./trigger.js', () => {
      const changedFiles = require('./trigger.js');
      reloadServerTranslation(changedFiles);
    });
  } else {
    log(`Server HMR has started`);

    const HMRPlugin = require('./plugin');
    HMRPlugin.addListener(reloadServerTranslation);
  }
};
