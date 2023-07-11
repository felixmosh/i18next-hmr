const HttpBackend = require('i18next-http-backend/cjs');
if (process.env.NODE_ENV !== 'production') {
  const { HMRPlugin } = require('i18next-hmr/plugin');
}

module.exports = {
  // https://www.i18next.com/overview/configuration-options#logging
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
  },
  ...(typeof window !== 'undefined'
    ? {
        backend: {
          loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
      }
    : {}),
  serializeConfig: false,
  use:
    process.env.NODE_ENV !== 'production'
      ? typeof window !== 'undefined'
        ? [HttpBackend, new HMRPlugin({ client: true })]
        : [new HMRPlugin({ server: true })]
      : [],
};
