export const setupI18nextHmr = async (i18nInstance) => {
  if (process.env.NODE_ENV !== 'production') {
    if (typeof window !== 'undefined') {
      const { applyClientHMR } = await import('i18next-hmr/client');
      applyClientHMR(i18nInstance);
    } else {
      const { applyServerHMR } = await import('i18next-hmr/server');
      applyServerHMR(i18nInstance);
    }
  }
};
