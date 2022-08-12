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
    [].concat(i18nInstance.options.ns, i18nInstance.options.fallbackNS || []).filter(Boolean)
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

module.exports = {
  printList: printList,
  extractList: extractList,
  uniqueList: uniqueList,
  createLoggerOnce: createLoggerOnce,
};
