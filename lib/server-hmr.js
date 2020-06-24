const { extractLangAndNS } = require('./utils');

module.exports = function applyServerHMR(i18n) {
  const pluginName = `\x1b[35m\x1b[1m${'I18NextHMR'}\x1b[0m\x1b[39m`;

  function log(message) {
    console.log(`[ ${pluginName} ] ${message}`);
  }

  function reloadServerTranslation({ changedFile }) {
    const { lang, ns } = extractLangAndNS(changedFile, i18n.options.ns);

    if (!lang || !ns) {
      return;
    }

    log(`Got an update with '${lang}', '${ns}'`);

    i18n.reloadResources([lang], [ns], (error) => {
      if (error) {
        log(`\x1b[31m\x1b[1m${error}\x1b[0m\x1b[39m`);
      } else {
        log(`Server reloaded locale of lang:'${lang}', namespace:'${ns}' successfully`);
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
      const { changedFile } = require('./trigger.js');
      reloadServerTranslation({ changedFile });
    });
  } else {
    log(`Server HMR has started`);

    const HMRPlugin = require('./plugin');
    HMRPlugin.addListener(reloadServerTranslation);
  }
};
