import { showMessage, showError } from "@/utils/notifications";
import { App } from "vue";

declare module "vue" {
  interface ComponentCustomProperties {
    $showMessage: typeof showMessage;
    $showError: typeof showError;
  }
}

export default {
  install(app: App) {
    app.config.globalProperties.$showMessage = showMessage;
    app.config.globalProperties.$showError = showError;
  },
};
