import '../styles/globals.css';
import { appWithSiteTranslations } from '../app/core/hocs/appWithSiteTranslations';
import { appWithReportTranslations } from '../app/core/hocs/appWithReportTranslations';
import { setupI18nextHmr } from '../app/core/utils/setupI18nextHmr';

setupI18nextHmr();

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default appWithSiteTranslations(appWithReportTranslations(MyApp));
