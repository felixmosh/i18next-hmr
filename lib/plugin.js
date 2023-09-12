class HMRPlugin {
  constructor(hmrOptions = {}) {
    this.type = '3rdParty';

    const webpack = hmrOptions.webpack || {};
    const vite = hmrOptions.vite || {};

    if (webpack.client && typeof window !== 'undefined') {
      const applyClientHMR = require('./webpack/client-hmr');
      applyClientHMR(() => this.i18nInstance);
    } else if (webpack.server && typeof window === 'undefined') {
      const applyServerHMR = require('./webpack/server-hmr');
      applyServerHMR(() => this.i18nInstance);
    } else if (vite.client && typeof window !== 'undefined') {
      const { applyViteClientHMR } = require('./vite/client-hmr');
      applyViteClientHMR(() => this.i18nInstance);
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
