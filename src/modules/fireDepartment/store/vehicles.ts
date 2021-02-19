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
    setVehicles(state, vehicles: Vehicle[]) {
      state.vehicles = vehicles;
    },
    setVehicle(state, vehicle: Vehicle | null) {
      state.vehicle = vehicle;
    },
  },

  actions: <ActionTree<State, any>>{
    bindVehicles({ commit }) {
      commit("setLoading");
      return firebase
        .database()
        .ref("vehicles")
        .get()
        .then((snapshot) => {
          const vehicles: Vehicle[] = [];
          snapshot.forEach((child) => {
            vehicles.push({
              id: child.ref.key,
              ...child.val(),
            });
          });
          commit("setVehicles", vehicles);
        })
        .catch((error) => handleError(commit, error))
        .finally(() => {
          commit("setLoading", false);
        });
    },
    unbindVehicles({ commit }) {
      commit("setVehicles", []);
    },

    bindVehicle({ commit, getters }, vehicleId: string) {
      const vehicle = getters.find(vehicleId);
      commit("setVehicle", vehicle);
    },
    unbindVehicle({ commit }) {
      commit("setVehicle", null);
    },

    unbind({ dispatch }) {
      dispatch("unbindVehicle");
      dispatch("unbindVehicles");
    },
  },
};
