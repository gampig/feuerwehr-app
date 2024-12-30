import { firebaseApp } from "@/firebase";
import { getDatabase, ref as dbRef, onValue } from "firebase/database";
import { ref } from "vue";
import { Debouncer } from "./debouncer";

export const useNetwork = () => {
  const isConnected = ref(true);
  const isConnectedDebounced = ref(true);

  const isConnectedDebouncer = new Debouncer(3000);

  const db = getDatabase(firebaseApp);
  const connectedRef = dbRef(db, ".info/connected");
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
