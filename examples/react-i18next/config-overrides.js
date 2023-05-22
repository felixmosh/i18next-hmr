const { I18NextHMRPlugin } = require('i18next-hmr/webpack');
const path = require('path');

module.exports = {
  webpack(config, env) {
    config.plugins = config.plugins || [];
    if (env === 'development') {
      config.plugins.push(
        new I18NextHMRPlugin({ localesDir: path.resolve(__dirname, 'public/locales') })
      );
    }

    return config;
  },
  devServer: function (configFunction) {
    return function (proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);

      if (config.static?.watch?.ignored) {
        config.static.watch.ignored = [config.static.watch.ignored, /\/locales\/.*\.json$/]; // prevents from dev-server to reload the page when locales are changing
      }

      return config;
    };
  },
};
