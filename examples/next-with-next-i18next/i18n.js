/*
  Do not copy/paste this file. It is used internally
  to manage end-to-end test suites.
*/

const NextI18Next = require('next-i18next').default;
const { localeSubpaths } = require('next/config').default().publicRuntimeConfig;
const { HMRPlugin } = require('i18next-hmr/plugin');
const localeSubpathVariations = {
  none: {},
  foreign: {
    de: 'de',
  },
  all: {
    en: 'en',
    de: 'de',
  },
};

const nextI18Next = new NextI18Next({
  otherLanguages: ['de'],
  localeSubpaths: localeSubpathVariations[localeSubpaths],
  use:
    process.env.NODE_ENV !== 'production'
      ? [
          new HMRPlugin({
            client: typeof window !== 'undefined',
            server: typeof window === 'undefined',
          }),
        ]
      : undefined,
});

module.exports = nextI18Next;
