import { showMessage } from "@/utils/notifications";
import { useNetwork } from "@/utils/useNetwork";
import { defineStore } from "pinia";
import { watch } from "vue";

export const useNetworkStore = defineStore("network", () => {
  const { isConnectedDebounced } = useNetwork();

  watch(isConnectedDebounced, (connected) => {
    if (connected) {
      showMessage("Verbindung zum Server wiederhergestellt.", "success");
    } else {
      showMessage("Keine Verbindung zum Server möglich.", "error");
    }
  });

  return { isConnectedDebounced };
});
