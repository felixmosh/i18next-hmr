import { createClient } from './i18nServerClient';

export const serverSideSiteTranslations = async (
  initialSiteLocale,
  supportedSiteLocales,
  additionalSiteNamespaces = []
) => {
  const siteNamespaces = [...additionalSiteNamespaces, 'common'];

  const { i18n, initPromise } = createClient({
    lng: initialSiteLocale,
    ns: siteNamespaces,
  });

  await initPromise;

  const siteStore = {};
  i18n.languages.forEach((language) => {
    siteStore[language] = {};
    siteNamespaces.forEach((namespace) => {
      siteStore[language][namespace] = i18n.store.data[language]?.[namespace] ?? {};
    });
  });

  return {
    _i18nSite: {
      initialSiteLocale,
      supportedSiteLocales,
      siteNamespaces,
      siteStore,
    },
  };
};
