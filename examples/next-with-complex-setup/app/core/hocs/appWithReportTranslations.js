import hoistNonReactStatics from 'hoist-non-react-statics';
import { useMemo } from 'react';
import { I18nReportContextProvider } from '../contexts/I18nReportContext';
import { createClient } from '../utils/i18nBrowserClient';
import { setupI18nextHmr } from '../utils/setupI18nextHmr';

export const appWithReportTranslations = (WrappedComponent) => {
  const AppWithReportTranslations = (props) => {
    const serverData = props.pageProps?._i18nReport;

    const i18nInstance = useMemo(() => {
      if (!serverData) return null;

      const { initialReportLocale, reportNamespaces, reportStore } = serverData;
      const client = createClient({
        lng: initialReportLocale,
        ns: reportNamespaces,
        resources: reportStore,
        fallbackNS: reportNamespaces,
      });
      return client.i18n;
    }, [serverData]);

    if (i18nInstance) {
      setupI18nextHmr(i18nInstance);
    }

    if (!serverData || !i18nInstance) {
      return <WrappedComponent {...props} />;
    }

    return (
      <I18nReportContextProvider
        value={{
          i18nReport: i18nInstance,
          supportedReportLocales: serverData.supportedReportLocales,
        }}
      >
        <WrappedComponent {...props} />
      </I18nReportContextProvider>
    );
  };

  return hoistNonReactStatics(AppWithReportTranslations, WrappedComponent);
};
