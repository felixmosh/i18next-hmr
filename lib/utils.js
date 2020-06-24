module.exports = {
  extractLangAndNS: function (changedFile, currentNSList) {
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
  },
};
