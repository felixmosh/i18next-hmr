module.exports = function applyServerHMR(i18n) {
  const pluginName = `\x1b[35m\x1b[1m${'I18NextHMR'}\x1b[0m\x1b[39m`;

  function log(message) {
    console.log(`[ ${pluginName} ] ${message}`);
  }

  function reloadServerTranslation({ lang, ns }) {
    i18n.reloadResources([lang], [ns], error => {
      if (error) {
        log(`\x1b[31m\x1b[1m${error}\x1b[0m\x1b[39m`);
      } else {
        log(
          `Server reloaded locale of lang:'${lang}', namespace:'${ns}' successfully`
        );
      }
    });
  }

  if (module.hot) {
    const { lang } = require('./trigger.js');

    if (!lang || lang) {
      // We must use the required variable
      log(`Server HMR has started`);
    }

    module.hot.accept('./trigger.js', () => {
      const { lang, ns } = require('./trigger.js');
      log(`Got an update with '${lang}', '${ns}'`);

      reloadServerTranslation({ lang, ns });
    });
  } else {
    log(`Server HMR has started`);

    const HMRPlugin = require('./plugin');
    HMRPlugin.addListener(reloadServerTranslation);
  }
};
