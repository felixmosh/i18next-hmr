import i18next from 'i18next';

declare const client: {
  applyClientHMR(i18n: i18next.i18n): void;
};

export = client;
