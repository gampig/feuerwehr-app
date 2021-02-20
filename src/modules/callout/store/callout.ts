import { firebaseAction } from "vuexfire";
import firebase from "firebase/app";
import serialize from "@/utils/firebase/serialize";
import handleError from "@/utils/store/handleError";
import { Callout, VehicleCrew, StandbyGroup, Group } from "../models/Callout";
import { ActionTree, GetterTree, MutationTree } from "vuex";

class State {
  loading = false;
  callout: Callout | null = null;
  standby: StandbyGroup | null = null;
  vehicles: { [vehicleId: string]: VehicleCrew } = {};

  getCallout() {
    if (this.callout == null) {
      throw new Error("Interner Fehler: Kein Einsatz gespeichert.");
    } else {
      return this.callout;
    }
  }
}

export default {
  namespaced: true,

  state: new State(),

  getters: <GetterTree<State, any>>{
    groupOfVehicle: (state) => (vehicleId: string) =>
      (state.vehicles && state.vehicles[vehicleId]) || {},
    groupCounts: (state) =>
      (state.vehicles &&
        Object.fromEntries(
          Object.entries(state.vehicles).map((entry) => [
            entry[0],
            Object.keys(entry[1]).length,
          ])
        )) ||
      {},
    personIsInCallout: (state) => (personId: string) =>
      state.standby?.people?.includes(personId) ||
      (state.vehicles &&
        Object.values(state.vehicles).some((vehicle) =>
          vehicle.people?.includes(personId)
        )) ||
      false,
  },

  mutations: <MutationTree<State>>{
    setLoading(state, loading) {
      state.loading = loading;
    },
  },

  actions: <ActionTree<State, any>>{
    bind: firebaseAction(({ bindFirebaseRef, commit }, calloutId: string) => {
      commit("setLoading", true);

      const calloutRef = firebase.database().ref("callouts").child(calloutId);
      const calloutGroupsRef = firebase
        .database()
        .ref("calloutGroups")
        .child(calloutId);

      const bindCallout = bindFirebaseRef("callout", calloutRef, { serialize });
      const bindStandby = bindFirebaseRef(
        "standby",
        calloutGroupsRef.child("standby"),
        { serialize }
      );
      const bindVehicles = bindFirebaseRef(
        "vehicles",
        calloutGroupsRef.child("vehicles"),
        { serialize }
      );

      return Promise.all([bindCallout, bindStandby, bindVehicles])
        .catch((error) => {
          return handleError(commit, error);
        })
        .finally(() => {
          commit("setLoading", false);
        });
    }),
    unbind: firebaseAction(({ unbindFirebaseRef }) => {
      unbindFirebaseRef("standby");
      unbindFirebaseRef("vehicles");
      unbindFirebaseRef("callout");
    }),

    updateCallout: firebaseAction(({ commit, state }, payload: Callout) => {
      const key = (state.callout != null && state.callout.id) || payload.id;

      if (key == null) {
        handleError(
          commit,
          new Error("Interner Fehler: Einsatz hat keine ID.")
        );
        return;
      }

      return firebase
        .database()
        .ref("callouts/" + key)
        .update(payload)
        .catch((error) => handleError(commit, error));
    }),

    updateVehicle: firebaseAction(
      (
        { commit, state },
        { crew, vehicleId }: { crew: VehicleCrew; vehicleId: string }
      ) => {
        let calloutKey: string | null;
        const vehicleKey = vehicleId;

        try {
          calloutKey = state.getCallout().id;
        } catch (e) {
          handleError(commit, e);
          return;
        }

        return firebase
          .database()
          .ref("calloutGroups/" + calloutKey)
          .child("vehicles/" + vehicleKey)
          .update(crew)
          .catch((error) => handleError(commit, error));
      }
    ),

    setGroupPeople: firebaseAction(
      (
        { state, commit },
        { groupId, people }: { groupId: string; people: Group }
      ) => {
        let calloutKey: string | null;
        try {
          calloutKey = state.getCallout().id;
        } catch (e) {
          handleError(commit, e);
          return;
        }

        const groupKey =
          groupId === "standby" ? "standby" : "vehicles/" + groupId;

        return firebase
          .database()
          .ref("callouts/" + calloutKey)
          .child("calloutGroups/" + groupKey)
          .child("people")
          .set(people)
          .catch((error) => handleError(commit, error));
      }
    ),
  },
};
