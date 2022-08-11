# i18next-hmr

[![npm](https://img.shields.io/npm/v/i18next-hmr.svg)](https://www.npmjs.com/package/i18next-hmr)
![CI](https://github.com/felixmosh/i18next-hmr/workflows/CI/badge.svg)

I18Next HMR🔥 webpack plugin that allows reloading translation resources on the client &amp; the server

## Requirements

- Node.js v10 or above
- Webpack 4.x - 5.x


## Installation

```sh
$ npm install --save-dev i18next-hmr
```

## Usage

Add the plugin to your webpack config (or nextjs).

<!-- prettier-ignore-start -->

```js
// webpack.config.js
const { I18NextHMRPlugin } = require('i18next-hmr/plugin');

module.exports = {
  ...
  plugins: [
    new I18NextHMRPlugin({
      localesDir: path.resolve(__dirname, 'static/locales'), 
      localesDirs: [
         // use this property for multiple locales directories   
      ]
    })
  ]
};
```

<!-- prettier-ignore-start -->

```js
// i18next.config.js
const i18next = require('i18next');
i18next.init(options, callback);
if (process.env.NODE_ENV !== 'production') {
  const { applyClientHMR } = require('i18next-hmr/client');
  applyClientHMR(i18next);
}
```

<!-- prettier-ignore-start -->

```js
// server.js
const express = require('express');

const i18n = require('./i18n');

if (process.env.NODE_ENV !== 'production') {
  const { applyServerHMR } = require('i18next-hmr/server');
  applyServerHMR(i18n);
}

const port = process.env.PORT || 3000;

(async () => {
  const server = express();
  server.get('*', (req, res) => handle(req, res));

  await server.listen(port);
  console.log(`> Ready on http://localhost:${port}`);
})();
```

Start the app with `NODE_ENV=development`

### Server side

The lib will trigger [`i18n.reloadResources([lang], [ns])`](https://www.i18next.com/overview/api#reloadresources) on the server side with `lang` & `namespace` extracted from the translation filename that was changed.

⚠️ If your server side is bundled using Webpack, the lib will use the native HMR (if enabled), for it to work properly the lib must be **bundled**, therefore, you should specify the lib as not [external](https://webpack.js.org/configuration/externals/).
There are 2 ways to do that:

1. if you are using [webpack-node-externals](https://github.com/liady/webpack-node-externals) specify `i18next-hmr` in the [`whitelist`](https://github.com/liady/webpack-node-externals#optionswhitelist-).
2. use a relative path to `node_modules`, something like:
   ```js
   // server.entry.js
   if (process.env.NODE_ENV !== 'production') {
     const { applyServerHMR } = require('../node_modules/i18next-hmr/server');
     applyServerHMR(i18n);
   }
   ```

### Client side

The lib will invoke Webpack's HMR to update client side, that will re-fetch (with cache killer) the updated translation files and trigger [`i18n.changelanguage(lang)`](https://www.i18next.com/overview/api#changelanguage) to trigger listeners (which in React apps it will update the UI).

## Example

Working examples can be found in the [`examples`](https://github.com/felixmosh/i18next-hmr/tree/master/examples) folder.

#### [`nextjs`](https://github.com/zeit/next.js) with [`next-i18next`](https://github.com/isaachinman/next-i18next)

![screenshot](https://user-images.githubusercontent.com/9304194/71188474-b1f97100-2289-11ea-9363-257f8a2124b1.gif)
