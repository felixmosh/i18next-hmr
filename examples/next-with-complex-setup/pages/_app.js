import '../styles/globals.css';
import {
  appWithSiteTranslations,
  siteTranslationInstance
} from '../app/core/hocs/appWithSiteTranslations';
import {
  appWithReportTranslations,
  siteReportInstance
} from '../app/core/hocs/appWithReportTranslations';
import { setupI18nextHmr } from '../app/core/utils/setupI18nextHmr';

setupI18nextHmr(({ changedFiles }) => {
  const changedFile = changedFiles[0];
  if(changedFile.startsWith('feature1')) {
    return siteTranslationInstance;
  }
  return siteReportInstance
});

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default appWithSiteTranslations(appWithReportTranslations(MyApp));
