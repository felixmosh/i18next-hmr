import glob from 'glob';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import path from 'path';
import { defaultConfig } from './i18nDefaultConfig';

const namespacesList = [];
let namespacesObject = null;

const loadNamespaces = (pattern) => {
  const namespaces = glob.sync(pattern).map((folder) => path.basename(folder));

  for (const namespace of namespaces) {
    if (namespacesList.includes(namespace)) {
      throw new Error(`Duplicate locales namespace: ${namespace}`);
    }
    namespacesList.push(namespace);
  }

  return namespaces;
};

const fetchNamespaces = () => {
  if (namespacesObject !== null) {
    return namespacesObject;
  }

  namespacesObject = {
    core: loadNamespaces('app/core/locales/*'),
    features: loadNamespaces('app/features/*'),
  };

  return namespacesObject;
};

const loadPath = (_lng, ns) => {
  const namespaces = fetchNamespaces();

  if (namespaces.core.includes(ns)) {
    const localesPath = path.join(process.cwd(), 'app', 'core', 'locales');
    return `${localesPath}/{{ns}}/{{lng}}.json`;
  }

  if (namespaces.features.includes(ns)) {
    const localesPath = path.join(process.cwd(), 'app', 'features');
    return `${localesPath}/{{ns}}/locales/{{lng}}.json`;
  }

  throw new Error(`Invalid locales namespace: ${ns}`);
};

export const createClient = (config) => {
  const instance = i18next.createInstance();

  const initPromise = instance.use(Backend).init({
    ...defaultConfig,
    backend: { loadPath: loadPath },
    ...config,
  });

  return { i18n: instance, initPromise };
};
