export const defaultConfig = {
  debug: false,
  fallbackLng: 'en',
  partialBundledLanguages: true,
  saveMissing: true,
  missingKeyHandler: (lngs, ns, key) => {
    console.error(
      `Missing translation key '${key}' of language(s)` +
        ` '${lngs.join(', ')}' in namespace '${ns}'.`
    );
  },
};
