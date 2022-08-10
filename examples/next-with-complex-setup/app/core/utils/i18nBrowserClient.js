import i18next, { InitOptions } from 'i18next';
import HttpBackend from 'i18next-http-backend';
import BackendAdapter from 'i18next-multiload-backend-adapter';
import { defaultConfig } from './i18nDefaultConfig';

export const createClient = (config) => {
  const instance = i18next.createInstance();

  const backend = {
    backend: HttpBackend,
    backendOption: {
      loadPath: '/api/locales?lng={{lng}}&ns={{ns}}',
    },
  };

  const initPromise = instance.use(BackendAdapter).init({
    ...defaultConfig,
    backend,
    ...config,
  });

  return { i18n: instance, initPromise };
};
