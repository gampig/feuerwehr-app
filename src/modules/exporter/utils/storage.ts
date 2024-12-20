import store from "@/store";
import { Callout, MannschaftenMap } from "@/modules/callout/models/Callout";
import { Person } from "@/modules/people/models/Person";
import { Vehicle } from "@/modules/vehicles/models/Vehicle";
import { usePeopleStore } from "@/modules/people/stores/people";
import { get, getDatabase, ref } from "firebase/database";
import { firebaseApp } from "@/firebase";

export default {
  getPersonen(): Person[] {
    return usePeopleStore().people as Person[];
  },

  getFahrzeuge(): Vehicle[] {
    return store.state.vehicles.vehicles as Vehicle[];
  },

  async fetchEinsaetze(): Promise<Callout[]> {
    return store.state.callouts.callouts as Callout[];
  },

  async fetchMannschaften() {
    const db = getDatabase(firebaseApp);
    const snapshot = await get(ref(db, "crew"));
    return snapshot.val() as MannschaftenMap;
  },
};
