import _Vue from "vue";
import { showMessage, showError } from "@/utils/notifications";

declare module "vue/types/vue" {
  interface Vue {
    $showMessage: typeof showMessage;
    $showError: typeof showError;
  }
}

export default {
  install(Vue: typeof _Vue, options?: any) {
    Vue.prototype.$showMessage = showMessage;
    Vue.prototype.$showError = showError;
  },
};
