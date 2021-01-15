const path = require('path');
const fs = require('fs');

const pluginName = 'I18nextHMRPlugin';

const DEFAULT_OPTIONS = {
  localesDir: '',
};

class I18nextHMRPlugin {
  constructor(options) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.lastUpdate = { changedFiles: [] };
  }

  apply(compiler) {
    const isWebpack5 = compiler.webpack ? parseInt(compiler.webpack.version, 10) === 5 : false;

    compiler.hooks.beforeCompile.tapAsync(pluginName, (params, callback) => {
      if (fs.existsSync(this.options.localesDir)) {
        return callback();
      }
      throw new Error(`i18next-hmr: '${this.options.localesDir}' not found`);
    });

    compiler.hooks.watchRun.tap(pluginName, (compiler) => {
      const changedTimes = isWebpack5
        ? compiler.watchFileSystem.watcher.getTimes()
        : (compiler.watchFileSystem.wfs || compiler.watchFileSystem).watcher.mtimes;

      const { startTime = 0 } = compiler.watchFileSystem.watcher;

      const files = Object.keys(changedTimes).filter((file) => {
        const fileExt = path.extname(file);

        return (
          file.includes(this.options.localesDir) && !!fileExt && changedTimes[file] > startTime
        );
      });

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
      nmf.hooks.createModule.tap(pluginName, (module) => {
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
