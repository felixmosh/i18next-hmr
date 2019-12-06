module.exports = function applyServerHMR(i18n) {
  const HMRPlugin = require('./plugin');
  const chalk = require('chalk');
  const pluginName = chalk.magentaBright('I18NextHMR');
  console.log(`[ ${pluginName} ] Server HMR has started`);

  HMRPlugin.addListener(async ({ lang, ns }) => {
    await i18n.reloadResources([lang], [ns]);
    console.log(`[ ${pluginName} ] Server reloaded locale of lang:'${lang}', namespace:'${ns}' successfully`);
  });
};
