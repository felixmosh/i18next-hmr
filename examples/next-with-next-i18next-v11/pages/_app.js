import { appWithTranslation, i18n } from 'next-i18next';
import nextI18NextConfig from '../next-i18next.config';

if (process.env.NODE_ENV !== 'production') {
  if (typeof window !== 'undefined') {
    const { applyClientHMR } = require('i18next-hmr/client');
    applyClientHMR(() => i18n);
  } else {
    const { applyServerHMR } = require('i18next-hmr/server');
    applyServerHMR(() => i18n);
  }
}

const MyApp = ({ Component, pageProps }) => <Component {...pageProps} />;

// https://github.com/i18next/next-i18next#unserialisable-configs
export default appWithTranslation(MyApp, nextI18NextConfig);
