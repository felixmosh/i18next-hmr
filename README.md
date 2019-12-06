
  
# i18next-hmr I18Next HMR 🔥webpack plugin that allows to reload translation resources on client &amp; server    
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
<!-- prettier-ignore-start -->
```js 
// webpack.config.js 
const { I18NextHMRPlugin } = require('i18next-hmr/plugin');    

module.exports = {  
  ...
  plugins: [    
    new I18NextHMRPlugin({  
      isServer: false, // for client only    
      localesDir: path.resolve(__dirname, 'static/locales'),    
    }) 
  ]
}; 
```
<!-- prettier-ignore-start -->    
```js 
// i18next.config.js 
const i18next = require('i18next'); 
i18next.init(options, callback);    
if (process.env.NODE_ENV === 'development') {    
  const { applyI18NextHMR } = require('i18next-hmr');    
  applyI18NextHMR(i18next); 
} 
``` 
Start the app with `NODE_ENV=development`
   
 ### Server side  
The lib will trigger [`i18n.reloadResources([lang], [ns])`](https://www.i18next.com/overview/api#reloadresources) on the server side with `lang` & `namespace` extracted from the translation filename that was changed. 
  
### Client side  
The lib will invoke webpacks hmr to update client side, that will re-fetch (with cache killer) the updated translation json, and trigger [`i18n.changelanguage(lang)`](https://www.i18next.com/overview/api#changelanguage) to trigger listeners (in React app it will update the UI).  
  
## Example  
A working [`nextjs`](https://github.com/zeit/next.js with [`next-i18next`](https://github.com/isaachinman/next-i18next) example can be found in the [`examples`](https://github.com/felixmosh/i18next-hmr/tree/master/examples) folder.

![screenshot](https://user-images.githubusercontent.com/9304194/70315852-1c8ac580-1823-11ea-9b74-f265020cc6f2.gif)
