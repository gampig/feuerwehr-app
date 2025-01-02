import "./firebase";
import App from "./App.vue";
import moment from "moment";
import "moment/dist/locale/de";
import { createPinia } from "pinia";
import { vuetify } from "./plugins/vuetify";
import notifier from "./plugins/notifier";
import unhandledErrorHandler from "./utils/unhandledErrorHandler";

import router from "./router";

// Globally register all `Base`-prefixed components
import "./components/globals";
import { createApp } from "vue";
import { registerGlobalComponents } from "./components/globals";

const pinia = createPinia();

const app = createApp(App);

app.use(router);
app.use(pinia);
app.use(notifier);
app.use(vuetify);

registerGlobalComponents(app);

app.config.errorHandler = unhandledErrorHandler;

moment.locale("de");

router
  .isReady()
  .then(() => app.mount("#app"))
  .catch((e) => console.error(e));
