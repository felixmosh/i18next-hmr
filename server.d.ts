import i18next from 'i18next';

declare const server: {
  applyServerHMR(i18n: i18next.i18n): void;
};

export = server;
