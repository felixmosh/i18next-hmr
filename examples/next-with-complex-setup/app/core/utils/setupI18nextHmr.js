const list = [];

export function addToHMRList(i18nInstance) {
  list.push(i18nInstance);
}

export const setupI18nextHmr = async () => {
  if (process.env.NODE_ENV !== 'production') {
    if (typeof window !== 'undefined') {
      const { applyClientHMR } = await import('i18next-hmr/client');
      applyClientHMR(list);
    } else {
      const { applyServerHMR } = await import('i18next-hmr/server');
      applyServerHMR(list);
    }
  }
};
