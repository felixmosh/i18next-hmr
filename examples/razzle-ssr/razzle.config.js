const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  modify: (defaultConfig, { target, dev }) => {
    if (dev) {
      const { I18NextHMRPlugin } = require('i18next-hmr/plugin');
      defaultConfig.plugins = [
        ...defaultConfig.plugins,
        new I18NextHMRPlugin({
          localesDir: path.resolve(__dirname, 'src/locales'),
        })];
    }
    return defaultConfig;
  }
};
