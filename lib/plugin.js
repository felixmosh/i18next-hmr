class HMRPlugin {
  constructor(hmrOptions = {}) {
    this.type = '3rdParty';

    if (hmrOptions.client && typeof window !== 'undefined') {
      const applyClientHMR = require('./client-hmr');
      applyClientHMR(() => this.i18nInstance);
    } else if (hmrOptions.server && typeof window === 'undefined') {
      const applyServerHMR = require('./server-hmr');
      applyServerHMR(() => {
        return this.i18nInstance;
      });
    }
  }

  init(i18nInstance) {
    this.i18nInstance = i18nInstance;
  }

  toJSON() {
    return null;
  }

  toString() {
    return 'HMRPlugin';
  }
}

module.exports.HMRPlugin = HMRPlugin;
