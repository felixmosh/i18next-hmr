import i18next from 'i18next';

declare const index: {
  applyClientHMR(i18n: i18next.i18n): void;

  applyServerHMR(i18n: i18next.i18n): void;
};

export = index;
