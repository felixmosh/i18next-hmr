const path = require('path');

module.exports = {
  modifyWebpackConfig: ({ webpackConfig, env: { dev } }) => {
    if (dev) {
      const { I18NextHMRPlugin } = require('i18next-hmr/plugin');
      webpackConfig.plugins.push(
        new I18NextHMRPlugin({
          localesDir: path.resolve(__dirname, 'src/locales'),
        })
      );
    }
    return webpackConfig;
  },
};
