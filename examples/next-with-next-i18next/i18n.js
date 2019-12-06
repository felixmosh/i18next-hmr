/*
  Do not copy/paste this file. It is used internally
  to manage end-to-end test suites.
*/

const NextI18Next = require('next-i18next').default;
const { localeSubpaths } = require('next/config').default().publicRuntimeConfig;

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
});

if (process.env.NODE_ENV === 'development') {
  const { applyI18NextHMR } = require('i18next-hmr');

  applyI18NextHMR(nextI18Next.i18n);
}

module.exports = nextI18Next;
