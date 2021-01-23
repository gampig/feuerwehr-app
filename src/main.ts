import Vue from "vue";
import "./firebase";
import App from "./App.vue";
import "./registerServiceWorker";
import moment from "moment";
import {
  formatDate,
  formatDateTime,
  formatDateTimeFromNow,
} from "./utils/dates";
import { vuetify } from "./plugins/vuetify";

import store from "./store";
import router from "./router";
import modules from "./modules";

import Page from "./components/pages/Page.vue";
import PageCentered from "./components/pages/PageCentered.vue";

Vue.config.productionTip = false;

Vue.filter("formatDate", formatDate);
Vue.filter("formatDateTime", formatDateTime);
Vue.filter("formatDateTimeFromNow", formatDateTimeFromNow);

Vue.component("Page", Page);
Vue.component("PageCentered", PageCentered);

modules.install(store, router);

moment.locale("de");

new Vue({
  store,
  router,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
