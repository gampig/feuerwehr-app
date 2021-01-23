import firebase from "firebase/app";
import serialize from "@/utils/firebase/serialize";
import { firebaseAction } from "vuexfire";
import handleError from "@/utils/store/handleError";
import { Person } from "../models/Person";
import { GetterTree, MutationTree } from "vuex";

class State {
  loading = false;
  people: Person[] = [];
}

export default {
  namespaced: true,

  state: new State(),

  mutations: <MutationTree<State>>{
    setLoading(state, loading: boolean) {
      state.loading = loading;
    },
  },

  getters: <GetterTree<State, any>>{
    find: (state) => (id: string) =>
      state.people.find((person) => person.id === id) ||
      <Person>{
        id: id,
        lastName: "Unbekannt",
        firstName: "-",
        status: "Unbekannt",
      },
    peopleReversed: (state) => [...state.people].reverse(),
    peopleByActivity: (state) =>
      [...state.people].sort(
        (a, b) => (b.recentCalloutsCount || 0) - (a.recentCalloutsCount || 0)
      ),
    peopleWithoutCrew(state, getters, rootState, rootGetters) {
      const people: Person[] = getters.peopleByActivity;
      return people.map((item) => {
        if (rootGetters["callout/findCrewMember"](item.id)) {
          return {
            ...item,
            disabled: true,
          };
        } else {
          return item;
        }
      });
    },
  },

  actions: {
    bindPeople: firebaseAction(({ bindFirebaseRef, commit }) => {
      commit("setLoading", true);
      return bindFirebaseRef(
        "people",
        firebase.database().ref("people").orderByChild("lastName"),
        {
          serialize,
        }
      )
        .catch((error) => handleError(commit, error))
        .finally(() => {
          commit("setLoading", false);
        });
    }),
    unbind: firebaseAction(({ unbindFirebaseRef }) => {
      unbindFirebaseRef("people");
    }),
  },
};
