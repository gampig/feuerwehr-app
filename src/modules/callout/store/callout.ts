import { firebaseAction } from "vuexfire";
import firebase from "firebase/app";
import serialize from "@/utils/firebase/serialize";
import handleError from "@/utils/store/handleError";
import { Callout, CalloutVehicle, Crew, CalloutRole } from "../models/Callout";
import { ActionTree, GetterTree, MutationTree } from "vuex";

interface CrewMemberId {
  vehicleId: string;
  personId: string;
}

class State {
  loading = false;
  callout: Callout | null = null;
  crew: Crew | null = null;

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
    crewOfVehicle: (state) => (vehicleId: string) =>
      (state.crew?.vehicles && state.crew?.vehicles[vehicleId]) || {},
    standbyCrew: (state) => state.crew?.standby || {},
    crewCounts: (state) =>
      (state.crew?.vehicles &&
        Object.fromEntries(
          Object.entries(state.crew.vehicles).map((entry) => [
            entry[0],
            Object.keys(entry[1]).length,
          ])
        )) ||
      {},
    findCrewMember: (state) => (personId: string) =>
      (state.crew?.standby && state.crew.standby[personId]) ||
      (state.crew?.vehicles &&
        Object.values(state.crew.vehicles).find((item) => item[personId])),
  },

  mutations: <MutationTree<State>>{
    setLoading(state, loading) {
      state.loading = loading;
    },
  },

  actions: <ActionTree<State, any>>{
    bind: firebaseAction(({ bindFirebaseRef, commit }, calloutId: string) => {
      commit("setLoading", true);

      const bindCallout = bindFirebaseRef(
        "callout",
        firebase.database().ref("callouts/" + calloutId),
        { serialize }
      );
      const bindCrew = bindFirebaseRef(
        "crew",
        firebase.database().ref("crew/" + calloutId),
        { serialize }
      );

      return Promise.all([bindCallout, bindCrew])
        .catch((error) => {
          return handleError(commit, error);
        })
        .finally(() => {
          commit("setLoading", false);
        });
    }),
    unbind: firebaseAction(({ unbindFirebaseRef }) => {
      unbindFirebaseRef("crew");
      unbindFirebaseRef("callout");
    }),

    updateCallout: firebaseAction(({ commit, state }, payload: Callout) => {
      const item = { ...payload } as any;
      const key = (state.callout != null && state.callout.id) || payload.id;

      if (key == null) {
        handleError(
          commit,
          new Error("Interner Fehler: Einsatz hat keine ID.")
        );
        return;
      }

      if (item.id != null) {
        delete item.id;
      }

      // Remove undefined properties
      for (const key in item) {
        if (item[key] === undefined) {
          delete item[key];
        }
      }

      return firebase
        .database()
        .ref("callouts/" + key)
        .update(item)
        .catch((error) => handleError(commit, error));
    }),
    updateVehicleDetails: firebaseAction(
      (
        { commit, state },
        { details, vehicleId }: { details: CalloutVehicle; vehicleId: string }
      ) => {
        const item = { ...details } as any;
        let calloutKey: string | null;
        const vehicleKey = vehicleId;

        try {
          calloutKey = state.getCallout().id;
        } catch (e) {
          handleError(commit, e);
          return;
        }

        // Remove undefined properties
        for (const key in item) {
          if (item[key] === undefined) {
            delete item[key];
          }
        }

        return firebase
          .database()
          .ref("callouts")
          .child(calloutKey)
          .child("vehicles")
          .child(vehicleKey)
          .update(item)
          .catch((error) => handleError(commit, error));
      }
    ),
    remove: firebaseAction(({ state, commit }) => {
      let calloutKey: string | null;
      try {
        calloutKey = state.getCallout().id;
      } catch (e) {
        handleError(commit, e);
        return;
      }

      return firebase
        .database()
        .ref("crew/" + calloutKey)
        .remove()
        .then(() =>
          firebase
            .database()
            .ref("callouts/" + calloutKey)
            .remove()
        )
        .catch((error) => handleError(commit, error));
    }),

    addCrewMember: firebaseAction(
      ({ commit, state }, { vehicleId, personId }: CrewMemberId) => {
        let calloutKey: string | null;
        try {
          calloutKey = state.getCallout().id;
        } catch (e) {
          handleError(commit, e);
          return;
        }
        return firebase
          .database()
          .ref("crew/" + calloutKey)
          .child("vehicles/" + vehicleId)
          .child(personId)
          .set(true)
          .catch((error) => handleError(commit, error));
      }
    ),
    addStandbyMember: firebaseAction(({ commit, state }, personId: string) => {
      let calloutKey: string | null;
      try {
        calloutKey = state.getCallout().id;
      } catch (e) {
        handleError(commit, e);
        return;
      }

      return firebase
        .database()
        .ref("crew/" + calloutKey)
        .child("standby")
        .child(personId)
        .set(true)
        .catch((error) => handleError(commit, error));
    }),
    updateRole: firebaseAction(
      (
        { commit, state },
        {
          vehicleId,
          personId,
          role,
        }: CrewMemberId & { role: CalloutRole | boolean }
      ) => {
        let calloutKey: string | null;
        try {
          calloutKey = state.getCallout().id;
        } catch (e) {
          handleError(commit, e);
          return;
        }

        return firebase
          .database()
          .ref("crew/" + calloutKey)
          .child("vehicles/" + vehicleId)
          .child(personId)
          .set(role)
          .catch((error) => handleError(commit, error));
      }
    ),
    removeCrewMember: firebaseAction(
      ({ commit, state }, { vehicleId, personId }: CrewMemberId) => {
        let calloutKey: string | null;
        try {
          calloutKey = state.getCallout().id;
        } catch (e) {
          handleError(commit, e);
          return;
        }

        return firebase
          .database()
          .ref("crew/" + calloutKey)
          .child("vehicles/" + vehicleId)
          .child(personId)
          .remove()
          .catch((error) => handleError(commit, error));
      }
    ),
    removeStandbyMember: firebaseAction(
      ({ commit, state }, personId: string) => {
        let calloutKey: string | null;
        try {
          calloutKey = state.getCallout().id;
        } catch (e) {
          handleError(commit, e);
          return;
        }

        return firebase
          .database()
          .ref("crew/" + calloutKey)
          .child("standby")
          .child(personId)
          .remove()
          .catch((error) => handleError(commit, error));
      }
    ),
  },
};
