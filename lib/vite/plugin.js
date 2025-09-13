const path = require('path');

const normalizePath = (p) => {
  const isWindows = typeof process !== 'undefined' && process.platform === 'win32';
  return path.posix.normalize(isWindows ? p.replace(/\\/g, '/') : p);
};

module.exports.i18nextHMRPlugin = function i18nextHMRPlugin(options) {
  let absoluteLocaleDirs = [];

  return {
    name: 'i18next-hmr',
    configResolved(config) {
      absoluteLocaleDirs = []
        .concat(options.localesDir, options.localesDirs)
        .filter(Boolean)
        .map((localeDir) =>
          normalizePath(
            path.isAbsolute(localeDir)
              ? localeDir
              : path.resolve(config.root || process.cwd(), localeDir)
          )
        );
    },
    handleHotUpdate({ file, server }) {
      const relevantLocaleDir = absoluteLocaleDirs.find((dir) => file.startsWith(dir));
      if (relevantLocaleDir) {
        const fileExt = path.extname(file);
        const relativePath = path.posix.relative(relevantLocaleDir, file);
        server.ws.send('i18next-hmr:locale-changed', {
          changedFiles: [relativePath.slice(0, -1 * fileExt.length || undefined)],
        });
      }
    },
  };
};
