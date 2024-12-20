import "./firebase";
import App from "./App.vue";
import "./registerServiceWorker";
import moment from "moment";
import { createPinia } from "pinia";
import { vuetify } from "./plugins/vuetify";
import notifier from "./plugins/notifier";
import unhandledErrorHandler from "./utils/unhandledErrorHandler";
import { useAuthStore } from "./stores/auth";

import store from "./store";
import router from "./router";
import modules from "./modules";

// Globally register all `Base`-prefixed components
import "./components/globals";
import { createApp } from "vue";
import { registerGlobalComponents } from "./components/globals";

const pinia = createPinia();

const app = createApp(App);

app.use(router);
app.use(pinia);
app.use(store);
app.use(notifier);
app.use(vuetify);

registerGlobalComponents(app);

app.config.errorHandler = unhandledErrorHandler;

moment.locale("de");

router
  .isReady()
  .then(() => app.mount("#app"))
  .catch((e) => console.error(e));

useAuthStore().init();

modules.install(store);
