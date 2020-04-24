const path = require('path');

module.exports = {
  modify: (defaultConfig, { dev }) => {
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
