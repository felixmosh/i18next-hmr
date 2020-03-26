import Vue from 'vue';
import App from './App.vue';
import VueI18Next from '@panter/vue-i18next';
import i18next from 'i18next';
import Backend from 'i18next-xhr-backend';


Vue.use(VueI18Next);

i18next
  .use(Backend)
  .init({
    lng: 'en',
  });

if (process.env.NODE_ENV !== 'production') {
  const { applyClientHMR } = require('i18next-hmr');
  applyClientHMR(i18next);
}

const i18n = new VueI18Next(i18next);


Vue.config.productionTip = false;

new Vue({
  i18n,
  render: h => h(App),
}).$mount('#app');
