function extractLangAndNS(changedFile, currentConfig) {
  const changedFileParts = changedFile.replace(/\\/g, '/').split('/');

  const firstLongestNSMatchParts = []
    .concat(currentConfig.namespaces)
    .map((ns) => ns.split('/'))
    .sort((a, b) => b.length - a.length)
    .find((optionalNS) =>
      optionalNS.every((optionalNSPart) => changedFileParts.includes(optionalNSPart))
    );

  if (!firstLongestNSMatchParts) {
    return { lang: null, ns: null };
  }

  const lang = changedFileParts
    .filter(
      (part) => !firstLongestNSMatchParts.includes(part) && currentConfig.languages.includes(part)
    )
    .join('/');

  return {
    lang,
    ns: firstLongestNSMatchParts.join('/'),
  };
}

function printList(list) {
  return list.map((item) => `${item.lang}/${item.ns}`).join(', ');
}

function extractList(changedFiles, i18nInstance) {
  const namespaces = uniqueList(
    []
      .concat(
        i18nInstance.options.ns,
        i18nInstance.options.fallbackNS,
        i18nInstance.options.defaultNS
      )
      .filter(Boolean)
  );
  const languages = uniqueList(
    [].concat(
      i18nInstance.languages,
      i18nInstance.options.supportedLngs,
      i18nInstance.options.lng,
      i18nInstance.options.fallbackLng
    )
  );

  return changedFiles
    .map((changedFile) => extractLangAndNS(changedFile, { namespaces, languages }))
    .filter(({ lang, ns }) => Boolean(lang) && Boolean(ns));
}

function uniqueList(list) {
  return [...new Set(list)];
}

function createLoggerOnce(logger) {
  const msgCount = new Map();
  return (msg, type = 'log') => {
    const count = msgCount.has(msg) ? msgCount.get(msg) : 0;
    if (count > 0) {
      return;
    }

    logger(msg, type);
    msgCount.set(msg, count + 1);
  };
}

function log(msg, type = 'log') {
  console[type](`[%cI18NextHMR%c] ${msg}`, 'color:#bc93b6', '');
}

const logOnce = createLoggerOnce(log);

async function reloadTranslations(list, i18nInstance) {
  let backendOptions = { queryStringParams: {} };
  try {
    backendOptions = i18nInstance.services.backendConnector.backend.options;
    backendOptions.queryStringParams = backendOptions.queryStringParams || {};
  } catch (e) {
    logOnce('Client i18next-http-backend not found, hmr may not work', 'warn');
  }

  backendOptions.queryStringParams._ = new Date().getTime(); // cache killer

  const langs = uniqueList(list.map((item) => item.lang));
  const namespaces = uniqueList(list.map((item) => item.ns));

  await i18nInstance.reloadResources(langs, namespaces, (error) => {
    if (error) {
      log(error, 'error');
      return;
    }

    const currentLang = i18nInstance.language;

    if (langs.includes(currentLang)) {
      i18nInstance.changeLanguage(currentLang);
      log(`Update applied successfully`);
    } else {
      log(`Resources of '${printList(list)}' were reloaded successfully`);
    }
  });
}

module.exports = {
  printList: printList,
  extractList: extractList,
  log: log,
  createLoggerOnce: createLoggerOnce,
  uniqueList: uniqueList,
  reloadTranslations: reloadTranslations,
};
