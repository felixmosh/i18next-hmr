/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  i18n: {
    localeDetection: false,
    locales: ['de', 'en'],
    defaultLocale: 'en',
  },
  webpack(config) {
    // Setup i18next-hmr
    if (config.mode === 'development') {
      const { I18NextHMRPlugin } = require('i18next-hmr/plugin');
      const path = require('path');
      config.plugins.push(
        // TODO: Investigate how to add multiple locales folders
        new I18NextHMRPlugin({
          localesDirs: [
            path.resolve(__dirname, 'app/core/locales'),
            path.resolve(__dirname, 'app/features')
          ],
        })
      );
    }
    return config;
  },
};

module.exports = nextConfig;
