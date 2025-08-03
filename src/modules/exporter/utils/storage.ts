import { crewRef } from "@/firebase";
import { MannschaftenMap } from "@/modules/callout/models/Callout";
import { useCalloutsStore } from "@/modules/callout/stores/callouts";
import { usePeopleStore } from "@/modules/people/stores/people";
import { useVehiclesStore } from "@/modules/vehicles/stores/vehicles";
import { get } from "firebase/database";

export default {
  getPersonen() {
    return usePeopleStore().promise;
  },

  getFahrzeuge() {
    return useVehiclesStore().promise;
  },

  getEinsaetze() {
    return useCalloutsStore().promise;
  },

  async getMannschaften() {
    const snapshot = await get(crewRef);
    return snapshot.val() as MannschaftenMap;
  },
};
