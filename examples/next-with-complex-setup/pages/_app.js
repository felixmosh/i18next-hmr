import '../styles/globals.css';
import { appWithSiteTranslations } from '../app/core/hocs/appWithSiteTranslations';
import { appWithReportTranslations } from '../app/core/hocs/appWithReportTranslations';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default appWithSiteTranslations(appWithReportTranslations(MyApp));
