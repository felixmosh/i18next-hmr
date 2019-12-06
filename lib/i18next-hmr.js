module.exports = function applyI18NextHMR(i18n) {
  if (typeof window === 'undefined') {
    const HMRPlugin = require('./plugin');
    const chalk = require('chalk');
    const pluginName = chalk.magentaBright('I18NextHMR');
    HMRPlugin.addListener(async ({ lang, ns }) => {
      await i18n.reloadResources([lang], [ns]);
      console.log(`[ ${pluginName} ] Server reloaded with lang:'${lang}', namespace:'${ns}'`);
    });
  } else {
    if (module.hot) {
      const { lang } = require('./trigger.js');

      if (!lang) {
        console.log('[I18NextHMR] has started!');
      }

      async function reloadTrans(lang, ns) {
        i18n.options.backend.queryStringParams = { _: new Date().getTime() };
        await i18n.reloadResources([lang], [ns]);
        i18n.changeLanguage(lang);
        console.log(`[I18NextHMR] Update applied successfully`);
      }

      module.hot.accept('./trigger.js', () => {
        const { lang, ns } = require('./trigger.js');
        console.log(`[I18NextHMR] Got an update with lang: '${lang}', namespace: '${ns}'`);

        if (i18n.language === lang) {
          return reloadTrans(lang, ns);
        }
      });
    }
  }
};
