const pluginName = 'I18nextHMRPlugin';
const path = require('path');

const DEFAULT_OPTIONS = {
  localesDir: '',
};

class I18nextHMRPlugin {
  constructor(options) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.lastUpdate = {};
  }

  apply(compiler) {
    compiler.hooks.watchRun.tap(pluginName, comp => {
      const changedTimes = comp.watchFileSystem.watcher.mtimes;
      const files = Object.keys(changedTimes).filter(file =>
        file.includes(this.options.localesDir)
      );

      if (files.length) {
        const parsedPath = path.parse(files[0]);
        const ns = parsedPath.name;
        const lang = path.basename(parsedPath.dir);

        if (this.lastUpdate.lang !== lang || this.lastUpdate.ns !== ns) {
          this.lastUpdate = { lang, ns };
        }

        I18nextHMRPlugin.callbacks.forEach(cb => cb({ ns, lang }));
      }
    });

    compiler.hooks.normalModuleFactory.tap(pluginName, nmf => {
      nmf.hooks.afterResolve.tap(pluginName, module => {
        const triggerPath = path.resolve(__dirname, 'trigger.js');
        if (module.resource === triggerPath) {
          module.loaders.push({
            loader: path.resolve(__dirname, 'loader.js'), // Path to loader
            options: {
              localesDir: this.options.localesDir,
              getChangedLang: () => ({ ...this.lastUpdate }),
            },
          });
        }
      });
    });
  }
}

I18nextHMRPlugin.callbacks = [];

I18nextHMRPlugin.addListener = function(cb) {
  I18nextHMRPlugin.callbacks.length = 0;
  I18nextHMRPlugin.callbacks.push(cb);
};

module.exports = I18nextHMRPlugin;
