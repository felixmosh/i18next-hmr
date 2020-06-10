module.exports = {
  extractLangAndNS: function(changedFile, currentNSList) {
    const firstLongestNSMatch = []
      .concat(currentNSList)
      .sort(function(a, b) {
        return b.length - a.length;
      })
      .find(function(optionalNS) {
        return changedFile.indexOf(optionalNS) > -1;
      });

    if (!firstLongestNSMatch) {
      return { lang: null, ns: null };
    }

    const nsParts = firstLongestNSMatch.split('/');
    const lang = changedFile
      .split('/')
      .filter(function(part) {
        return nsParts.indexOf(part) === -1;
      })
      .join('/');

    return {
      lang,
      ns: firstLongestNSMatch,
    };
  },
};
