import firebase from "firebase/app";
import handleError from "@/utils/store/handleError";
import { Person } from "../models/Person";
import { ActionTree, GetterTree, MutationTree } from "vuex";
import CrudFactory from "@/utils/firebase/CrudFactory";

class State {
  loading = false;
  people: Person[] = [];
}

const crudFactory = new CrudFactory<State, Person>("people");

export default {
  namespaced: true,

  state: new State(),

  mutations: <MutationTree<State>>{
    setLoading(state, loading: boolean) {
      state.loading = loading;
    },
    setPeople(state, people: Person[]) {
      state.people = people;
    },
  },

  getters: <GetterTree<State, any>>{
    peopleReversed: (state) => [...state.people].reverse(),
    peopleByActivity: (state) =>
      [...state.people].sort(
        (a, b) => (b.recentCalloutsCount || 0) - (a.recentCalloutsCount || 0)
      ),
    peopleWithoutCrew(state, getters, rootState, rootGetters) {
      const people: Person[] = getters.peopleByActivity;
      return people
        .map<Person & { disabled?: boolean }>((item) => {
          if (rootGetters["callout/findCrewMember"](item.id)) {
            return {
              ...item,
              disabled: true,
            };
          } else {
            return item;
          }
        })
        .sort((a, b) => {
          if (a.disabled == b.disabled) {
            return 0;
          } else if (a.disabled && !b.disabled) {
            return 1;
          } else {
            return -1;
          }
        });
    },
  },

  actions: <ActionTree<State, any>>{
    bindPeople({ commit }) {
      commit("setLoading", true);
      return firebase
        .database()
        .ref("people")
        .get()
        .then((snapshot) => {
          const people: Person[] = [];
          snapshot.forEach((child) => {
            people.push({
              id: child.ref.key,
              ...child.val(),
            });
          });
          commit("setPeople", people);
        })
        .catch((error) => handleError(commit, error))
        .finally(() => {
          commit("setLoading", false);
        });
    },
    unbind({ commit }) {
      commit("setPeople", []);
    },

    set: crudFactory.makeSet((person) => person),
  },
};
