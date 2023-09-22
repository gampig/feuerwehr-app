import Vue from "vue";
import "./firebase";
import App from "./App.vue";
import "./registerServiceWorker";
import moment from "moment";
import { vuetify } from "./plugins/vuetify";
import notifier from "./plugins/notifier";

import store from "./store";
import router from "./router";
import modules from "./modules";

// Globally register all `Base`-prefixed components
import "./components/globals";

Vue.use(notifier);

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

Vue.config.errorHandler = function (err, vm, info) {
  alert(
    `Ein Fehler ist aufgetreten :-(\nBitte mache einen Screenshot dieser Meldung.\n\nFehlerinfo: ${info}\nFehlertext: ${err}`
  );
};

modules.install(store, router);

moment.locale("de");

new Vue({
  store,
  router,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
