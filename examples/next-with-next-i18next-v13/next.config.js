const { i18n } = require('./next-i18next.config');
const path = require('path');

module.exports = {
  i18n,
  webpack(config, { isServer }) {
    if (!isServer && config.mode === 'development') {
      const { I18NextHMRPlugin } = require('i18next-hmr/webpack');
      config.plugins.push(
        new I18NextHMRPlugin({
          localesDir: path.resolve(__dirname, 'public/locales'),
        })
      );
    }

    return config;
  },
};
