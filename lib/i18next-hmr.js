module.exports = function applyI18nextHMR(i18n) {
  if (typeof window === 'undefined') {
    const HMRPlugin = require('./plugin');
    const chalk = require('chalk');

    HMRPlugin.addListener(async ({ lang, ns }) => {
      console.log(
        `[ ${chalk.magentaBright(
          'I18nextHMR'
        )} ] Server reloaded with lang:'${lang}', namespace:'${ns}'`
      );

      await i18n.reloadResources([lang], [ns]);
    });
  } else {
    if (module.hot) {
      const { lang } = require('./trigger.js');

      if (!lang) {
        console.log('[I18nextHMR] has started!');
      }

      async function reloadTrans(lang, ns) {
        i18n.options.backend.queryStringParams = { _: new Date().getTime() };
        await i18n.reloadResources([lang], [ns]);
        i18n.changeLanguage(lang);
      }

      module.hot.accept('./trigger.js', () => {
        const { lang, ns } = require('./trigger.js');
        console.log(`[I18nextHMR] Got an update lang: '${lang}', namespace: '${ns}'`);

        if (i18n.language === lang) {
          console.log(`[I18nextHMR] Update applied successfully`);
          return reloadTrans(lang, ns);
        }
      });
    }
  }
};
