const path = require('path');

module.exports.i18nextHMRPlugin = function i18nextHMRPlugin(options) {
  let absoluteLocaleDirs = [];

  return {
    name: 'i18next-hmr',
    configResolved(config) {
      absoluteLocaleDirs = []
        .concat(options.localesDir, options.localesDirs)
        .filter(Boolean)
        .map((localeDir) =>
          path.isAbsolute(localeDir)
            ? localeDir
            : path.resolve(config.root || process.cwd(), localeDir)
        );
    },
    handleHotUpdate({ file, server }) {
      const relevantLocaleDir = absoluteLocaleDirs.find((dir) => file.startsWith(dir));
      if (relevantLocaleDir) {
        const fileExt = path.extname(file);
        server.ws.send('i18next-hmr:locale-changed', {
          changedFiles: [
            path.relative(relevantLocaleDir, file).slice(0, -1 * fileExt.length || undefined),
          ],
        });
      }
    },
  };
};
