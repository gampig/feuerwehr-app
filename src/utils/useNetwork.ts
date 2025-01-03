import { connectedRef } from "@/firebase";
import { onValue } from "firebase/database";
import { ref } from "vue";
import { Debouncer } from "./debouncer";

export const useNetwork = () => {
  const isConnected = ref(true);
  const isConnectedDebounced = ref(true);

  const isConnectedDebouncer = new Debouncer(3000);

  onValue(connectedRef, (snap) => {
    if (snap.val() === true) {
      isConnected.value = true;
      isConnectedDebouncer.clear();
      isConnectedDebounced.value = true;
    } else {
      isConnected.value = false;
      isConnectedDebouncer.debounce(() => {
        isConnectedDebounced.value = false;
      });
    }
  });

  return { isConnected, isConnectedDebounced };
};
