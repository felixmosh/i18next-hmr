import hoistNonReactStatics from 'hoist-non-react-statics';
import { useMemo } from 'react';
import { I18nSiteContextProvider } from '../contexts/I18nSiteContext';
import { createClient } from '../utils/i18nBrowserClient';
import { setupI18nextHmr } from '../utils/setupI18nextHmr';

export const appWithSiteTranslations = (WrappedComponent) => {
  const AppWithSiteTranslations = (props) => {
    const serverData = props.pageProps?._i18nSite;

    const i18nInstance = useMemo(() => {
      if (!serverData) return null;

      const { initialSiteLocale, siteNamespaces, siteStore } = serverData;
      const client = createClient({
        lng: initialSiteLocale,
        ns: siteNamespaces,
        resources: siteStore,
        fallbackNS: siteNamespaces,
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
      <I18nSiteContextProvider
        value={{ i18nSite: i18nInstance, supportedSiteLocales: serverData.supportedSiteLocales }}
      >
        <WrappedComponent {...props} />
      </I18nSiteContextProvider>
    );
  };

  return hoistNonReactStatics(AppWithSiteTranslations, WrappedComponent);
};
