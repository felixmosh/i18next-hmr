const pluginName = 'I18nextHMRPlugin';
const path = require('path');
const fs = require('fs');

const DEFAULT_OPTIONS = {
  localesDir: '',
};

class I18nextHMRPlugin {
  constructor(options) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.lastUpdate = {};
  }

  apply(compiler) {
    compiler.hooks.beforeCompile.tapAsync(pluginName, (params, callback) => {
      if (fs.existsSync(this.options.localesDir)) {
        return callback();
      }
      throw new Error(`i18next-hmr: '${this.options.localesDir}' not found`);
    });

    compiler.hooks.watchRun.tap(pluginName, (compiler) => {
      const changedTimes = (compiler.watchFileSystem.wfs || compiler.watchFileSystem).watcher
        .mtimes;

      const files = Object.keys(changedTimes).filter((file) =>
        file.includes(this.options.localesDir)
      );

      if (!files.length) {
        return;
      }

      const changedFiles = files.map((file) => {
        const fileExt = path.extname(file);

        return path
          .relative(this.options.localesDir, file)
          .slice(0, -1 * fileExt.length || undefined); // keep all when fileExt.length === 0
      });

      this.lastUpdate = { changedFiles };

      I18nextHMRPlugin.callbacks.forEach((cb) => cb({ changedFiles }));
    });

    compiler.hooks.normalModuleFactory.tap(pluginName, (nmf) => {
      nmf.hooks.afterResolve.tap(pluginName, (module) => {
        const triggerPath = path.resolve(__dirname, 'trigger.js');
        if (module.resource !== triggerPath) {
          return;
        }

        module.loaders.push({
          loader: path.resolve(__dirname, 'loader.js'), // Path to loader
          options: {
            localesDir: this.options.localesDir,
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
