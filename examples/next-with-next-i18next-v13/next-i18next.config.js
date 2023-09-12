const HttpBackend = require('i18next-http-backend/cjs');
const HMRPlugin = process.env.NODE_ENV !== 'production' ? require('i18next-hmr/plugin').HMRPlugin : undefined;

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
  // allows reloading translations on each page navigation / a hacky way to reload translations on the server at Next v13
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  use:
    process.env.NODE_ENV !== 'production'
      ? typeof window !== 'undefined'
        ? [HttpBackend, new HMRPlugin({ webpack: { client: true } })]
        : [new HMRPlugin({ webpack: { server: true } })]
      : [],
};
