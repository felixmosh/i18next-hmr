import { createClient } from './i18nServerClient';

export const serverSideReportTranslations = async (
  initialReportLocale,
  supportedReportLocales,
  additionalReportNamespaces = []
) => {
  const reportNamespaces = [...additionalReportNamespaces, 'common'];

  const { i18n, initPromise } = createClient({
    lng: initialReportLocale,
    ns: reportNamespaces,
  });

  await initPromise;

  const reportStore = {};
  i18n.languages.forEach((language) => {
    reportStore[language] = {};
    reportNamespaces.forEach((namespace) => {
      reportStore[language][namespace] = i18n.store.data[language]?.[namespace] ?? {};
    });
  });

  return {
    _i18nReport: {
      initialReportLocale,
      supportedReportLocales,
      reportNamespaces,
      reportStore,
    },
  };
};
