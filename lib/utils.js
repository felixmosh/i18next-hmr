function extractLangAndNS(changedFile, currentNSList) {
  const changedFileParts = changedFile.replace(/\\/g, '/').split('/');

  const firstLongestNSMatchParts = []
    .concat(currentNSList)
    .map((ns) => ns.split('/'))
    .sort((a, b) => b.length - a.length)
    .find((optionalNS) =>
      optionalNS.every((optionalNSPart) => changedFileParts.includes(optionalNSPart))
    );

  if (!firstLongestNSMatchParts) {
    return { lang: null, ns: null };
  }

  const lang = changedFileParts
    .filter((part) => !firstLongestNSMatchParts.includes(part))
    .join('/');

  return {
    lang,
    ns: firstLongestNSMatchParts.join('/'),
  };
}

function printList(list) {
  return list.map((item) => `${item.lang}/${item.ns}`).join(', ');
}

function extractList(changedFiles, currentNSList) {
  return changedFiles
    .map((changedFile) => extractLangAndNS(changedFile, currentNSList))
    .filter(({ lang, ns }) => Boolean(lang) && Boolean(ns));
}

function makeUniqueList(list) {
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
  makeUniqueList: makeUniqueList,
  createLoggerOnce: createLoggerOnce,
};
