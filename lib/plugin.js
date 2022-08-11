const path = require('path');
const fs = require('fs');

const pluginName = 'I18nextHMRPlugin';

const DEFAULT_OPTIONS = {
  localesDir: '',
  localesDirs: [],
};

class I18nextHMRPlugin {
  constructor(options) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.options.localesDirs = []
      .concat(this.options.localesDirs, this.options.localesDir)
      .filter(Boolean);
    this.lastUpdate = { changedFiles: [] };
  }

  apply(compiler) {
    const isWebpack5 = compiler.webpack
      ? +compiler.webpack.version.split('.').reverse().pop() === 5
      : false;

    compiler.hooks.beforeCompile.tapAsync(pluginName, (params, callback) => {
      const noneExistsDirs = this.options.localesDirs.filter((dir) => !fs.existsSync(dir));

      if (noneExistsDirs.length === 0) {
        return callback();
      }
      throw new Error(
        `i18next-hmr: \n'${noneExistsDirs.join(`',\n'`)}'${
          noneExistsDirs.length > 1 ? '\nare' : ''
        } not found`
      );
    });

    compiler.hooks.watchRun.tap(pluginName, (compiler) => {
      const watcher = (compiler.watchFileSystem.wfs || compiler.watchFileSystem).watcher;
      const changedTimes = isWebpack5 ? watcher.getTimes() : watcher.mtimes;

      const { startTime = 0 } = watcher || {};

      const files = Object.keys(changedTimes).filter((file) => {
        const fileExt = path.extname(file);

        return (
          this.options.localesDirs.some((dir) => file.startsWith(dir)) &&
          !!fileExt &&
          changedTimes[file] > startTime
        );
      });

      if (!files.length) {
        return;
      }

      const changedFiles = files.map((file) => {
        const fileExt = path.extname(file);
        const dir = this.options.localesDirs.find((dir) => file.startsWith(dir));

        return path.relative(dir, file).slice(0, -1 * fileExt.length || undefined); // keep all when fileExt.length === 0
      });

      this.lastUpdate = { changedFiles };

      I18nextHMRPlugin.callbacks.forEach((cb) => cb({ changedFiles }));
    });

    compiler.hooks.normalModuleFactory.tap(pluginName, (nmf) => {
      nmf.hooks.createModule.tap(pluginName, (module) => {
        const triggerPath = path.resolve(__dirname, 'trigger.js');
        if (module.resource !== triggerPath) {
          return;
        }

        module.loaders.push({
          loader: path.resolve(__dirname, 'loader.js'), // Path to loader
          options: {
            localesDirs: this.options.localesDirs,
            getChangedLang: () => ({ ...this.lastUpdate }),
          },
        });
      });
    });
  }
}

I18nextHMRPlugin.callbacks = [];

I18nextHMRPlugin.addListener = function (cb) {
  I18nextHMRPlugin.callbacks.length = 0;
  I18nextHMRPlugin.callbacks.push(cb);
};

module.exports = I18nextHMRPlugin;
