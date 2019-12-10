module.exports = function applyServerHMR(i18n) {
  const HMRPlugin = require('./plugin');
  const pluginName = `\x1b[35m\x1b[1m${'I18NextHMR'}\x1b[0m`;
  console.log(`[ ${pluginName} ] Server HMR has started`);

  HMRPlugin.addListener(async ({ lang, ns }) => {
    await i18n.reloadResources([lang], [ns]);
    console.log(`[ ${pluginName} ] Server reloaded locale of lang:'${lang}', namespace:'${ns}' successfully`);
  });
};
