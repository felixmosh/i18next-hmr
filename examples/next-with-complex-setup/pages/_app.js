import '../styles/globals.css';
import { appWithSiteTranslations } from '../app/core/hocs/appWithSiteTranslations';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default appWithSiteTranslations(MyApp);
