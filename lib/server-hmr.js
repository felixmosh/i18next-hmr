module.exports = function applyServerHMR(i18n) {
  const HMRPlugin = require('./plugin');
  const pluginName = `\x1b[35m\x1b[1m${'I18NextHMR'}\x1b[0m\x1b[39m`;
  console.log(`[ ${pluginName} ] Server HMR has started`);

  HMRPlugin.addListener(async ({ lang, ns }) => {
    await i18n.reloadResources([lang], [ns], error => {
      if (error) {
        console.log(`[ ${pluginName} ] \x1b[31m\x1b[1m${error}\x1b[0m\x1b[39m`);
      } else {
        console.log(
          `[ ${pluginName} ] Server reloaded locale of lang:'${lang}', namespace:'${ns}' successfully`
        );
      }
    });
  });
};
