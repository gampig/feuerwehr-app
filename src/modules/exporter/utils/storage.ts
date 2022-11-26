import store from "@/store";
import firebase from "firebase/app";
import { Callout, MannschaftenMap } from "@/modules/callout/models/Callout";
import { Person } from "@/modules/people/models/Person";
import { Vehicle } from "@/modules/vehicles/models/Vehicle";

export default {
  getPersonen(): Person[] {
    return store.state.people.people as Person[];
  },

  getFahrzeuge(): Vehicle[] {
    return store.state.vehicles.vehicles as Vehicle[];
  },

  async fetchEinsaetze(): Promise<Callout[]> {
    if (!store.state.callouts.allCalloutsLoaded) {
      await store.dispatch("callouts/bind", { loadAllCallouts: true });
    }
    return store.state.callouts.callouts as Callout[];
  },

  async fetchMannschaften() {
    const snapshot = await firebase.database().ref("crew").once("value");
    return snapshot.val() as MannschaftenMap;
  },
};
