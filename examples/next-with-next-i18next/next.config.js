const { I18NextHMRPlugin } = require('i18next-hmr/plugin');
const path = require('path');

module.exports = {
  publicRuntimeConfig: {
    localeSubpaths: typeof process.env.LOCALE_SUBPATHS === 'string'
      ? process.env.LOCALE_SUBPATHS
      : 'none',
  },
  webpack(config, options) {

    if (!options.isServer) {
      config.plugins.push(
        new I18NextHMRPlugin({
          localesDir: path.resolve(__dirname, 'static/locales')
        })
      );
    }

    return config;
  }
};

