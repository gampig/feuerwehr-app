import Vue from "vue";
import "./firebase";
import App from "./App.vue";
import "./registerServiceWorker";
import moment from "moment";
import { createPinia, PiniaVuePlugin } from "pinia";
import VueRouter from "vue-router";
import { vuetify } from "./plugins/vuetify";
import notifier from "./plugins/notifier";
import unhandledErrorHandler from "./utils/unhandledErrorHandler";
import { useAuthStore } from "./stores/auth";

import store from "./store";
import router from "./router";
import modules from "./modules";

// Globally register all `Base`-prefixed components
import "./components/globals";

Vue.use(PiniaVuePlugin);
const pinia = createPinia();

Vue.use(notifier);
Vue.use(VueRouter);

// Filters
import {
  formatDate,
  formatDateTime,
  formatDateTimeFromNow,
} from "./utils/dates";
Vue.filter("formatDate", formatDate);
Vue.filter("formatDateTime", formatDateTime);
Vue.filter("formatDateTimeFromNow", formatDateTimeFromNow);

Vue.config.productionTip = false;

Vue.config.errorHandler = unhandledErrorHandler;

moment.locale("de");

new Vue({
  store,
  pinia,
  router,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");

useAuthStore().init();

modules.install(store);
