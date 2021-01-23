import { firebaseAction } from "vuexfire";
import serialize from "@/utils/firebase/serialize";
import firebase from "firebase/app";
import handleError from "@/utils/store/handleError";
import { Vehicle } from "../models/Vehicle";
import { ActionTree, GetterTree, MutationTree } from "vuex";

class State {
  loading = false;
  vehicles: Vehicle[] = [];
  vehicle: Vehicle | null = null;
}

export default {
  namespaced: true,

  state: new State(),

  getters: <GetterTree<State, any>>{
    find: (state) => (id: string) =>
      state.vehicles.find((item) => item.id === id) ||
      <Vehicle>{
        id: id,
        name: id,
      },
  },

  mutations: <MutationTree<State>>{
    setLoading(state, loading: boolean) {
      state.loading = loading;
    },
  },

  actions: <ActionTree<State, any>>{
    bindVehicles: firebaseAction(({ bindFirebaseRef, commit }) => {
      commit("setLoading");
      return bindFirebaseRef(
        "vehicles",
        firebase.database().ref("vehicles").orderByChild("inServiceSince"),
        { serialize }
      )
        .catch((error) => handleError(commit, error))
        .finally(() => {
          commit("setLoading", false);
        });
    }),
    unbindVehicles: firebaseAction(({ unbindFirebaseRef }) => {
      unbindFirebaseRef("vehicles");
    }),

    bindVehicle: firebaseAction(
      ({ bindFirebaseRef, commit }, vehicleId: string) => {
        return bindFirebaseRef(
          "vehicle",
          firebase.database().ref("vehicles").child(vehicleId),
          {
            serialize,
          }
        ).catch((error) => handleError(commit, error));
      }
    ),
    unbindVehicle: firebaseAction(({ unbindFirebaseRef }) => {
      unbindFirebaseRef("vehicle");
    }),

    unbind({ dispatch }) {
      dispatch("unbindVehicle");
      dispatch("unbindVehicles");
    },
  },
};
