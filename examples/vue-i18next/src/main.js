import Vue from 'vue';
import App from './App.vue';
import VueI18Next from '@panter/vue-i18next';
import i18next from 'i18next';
import Backend from 'i18next-xhr-backend';
import { HMRPlugin } from 'i18next-hmr/plugin';

Vue.use(VueI18Next);

const instance = i18next.use(Backend);

if (process.env.NODE_ENV !== 'production') {
  instance.use(new HMRPlugin({ webpack: { client: true } }));
}

instance.init({
  lng: 'en',
});

const i18n = new VueI18Next(instance);

Vue.config.productionTip = false;

new Vue({
  i18n,
  render: (h) => h(App),
}).$mount('#app');
