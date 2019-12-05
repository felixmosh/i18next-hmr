
# i18next-hmr  
I18Next HMR 🔥webpack plugin that allows to reload translation resources on client &amp; server  
**This lib is under development**    

## Requirements  
  
- Node.js v8 or above  
- Webpack 4.x  
  
## Installation  
  
```sh  
$ npm install --save-dev i18next-hmr  
```  
  
## Usage  
  
Add the plugin to your webpack config (or nextjs).  
  
```js  
// webpack.config.js  
const { I18nextHMRPlugin } = require('i18next-hmr/plugin');  
  
module.exports = {  module: {  
 ... },  plugins: [  
 new I18nextHMRPlugin({  isServer: false, // for client only  
  localesDir: path.resolve(__dirname, 'static/locales'),  
 }) ]};  
```  
  
```js  
// i18next.config.js  
const i18next = require('i18next');   
i18next.init(options, callback);  
  
if (process.env.NODE_ENV === 'development') {  
 const { applyI18nextHMR } = require('i18next-hmr');  
 applyI18nextHMR(i18next);  
}  
```  
 ### Server side
The lib will trigger [`i18n.reloadResources([lang], [ns])`](https://www.i18next.com/overview/api#reloadresources) on the server side with `lang` & `namespace` extracted from the translation filename that was changed.

### Client side
The lib will invoke webpacks hmr to update client side, that will refetch (with cache killer) the updated translation json, and trigger [`i18n.changelanguage(lang)`](https://www.i18next.com/overview/api#changelanguage) to trigger listeners (in React app it will update the UI).

## Example
A working [`nextjs`]([https://github.com/zeit/next.js](https://github.com/zeit/next.js)) with [`next-i18next`]([https://github.com/isaachinman/next-i18next](https://github.com/isaachinman/next-i18next)) example can be found in the [`examples`](https://github.com/felixmosh/i18next-hmr/tree/master/examples) folder.
