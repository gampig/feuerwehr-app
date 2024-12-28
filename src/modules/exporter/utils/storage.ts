import { MannschaftenMap } from "@/modules/callout/models/Callout";
import { usePeopleStore } from "@/modules/people/stores/people";
import { get, getDatabase, ref } from "firebase/database";
import { firebaseApp } from "@/firebase";
import { useVehiclesStore } from "@/modules/vehicles/stores/vehicles";
import { useCalloutsStore } from "@/modules/callout/stores/callouts";

export default {
  getPersonen() {
    return usePeopleStore().people;
  },

  getFahrzeuge() {
    return useVehiclesStore().vehicles;
  },

  getEinsaetze() {
    return useCalloutsStore().callouts;
  },

  async fetchMannschaften() {
    const db = getDatabase(firebaseApp);
    const snapshot = await get(ref(db, "crew"));
    return snapshot.val() as MannschaftenMap;
  },
};
