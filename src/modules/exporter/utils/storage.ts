import store from "@/store";
import { Callout, MannschaftenMap } from "@/modules/callout/models/Callout";
import { Person } from "@/modules/people/models/Person";
import { Vehicle } from "@/modules/vehicles/models/Vehicle";
import { usePeopleStore } from "@/modules/people/stores/people";
import { get, getDatabase, ref } from "firebase/database";
import { firebaseApp } from "@/firebase";
import { useVehiclesStore } from "@/modules/vehicles/stores/vehicles";
import { useCalloutsStore } from "@/modules/callout/stores/callouts";

export default {
  getPersonen(): Person[] {
    return usePeopleStore().people as Person[];
  },

  getFahrzeuge(): Vehicle[] {
    return useVehiclesStore().vehicles;
  },

  async fetchEinsaetze(): Promise<Callout[]> {
    return useCalloutsStore().callouts;
  },

  async fetchMannschaften() {
    const db = getDatabase(firebaseApp);
    const snapshot = await get(ref(db, "crew"));
    return snapshot.val() as MannschaftenMap;
  },
};
