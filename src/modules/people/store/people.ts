import firebase from "firebase/app";
import handleError from "@/utils/store/handleError";
import { Person } from "../models/Person";
import { ActionTree, GetterTree, MutationTree } from "vuex";
import CrudFactory from "@/utils/firebase/CrudFactory";
import { PersonWithCrewName } from "@/modules/callout/models/Callout";

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
        .map<PersonWithCrewName>((item) => {
          const crewOfPerson = rootGetters["callout/findCrewOfPerson"](
            item.id
          ) as string | undefined;
          return {
            ...item,
            crewName: crewOfPerson,
          };
        })
        .sort((a, b) => {
          if (a.crewName == b.crewName) {
            return 0;
          } else if (a.crewName && !b.crewName) {
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
        .catch((error) => handleError(error))
        .finally(() => {
          commit("setLoading", false);
        });
    },
    unbind({ commit }) {
      commit("setPeople", []);
    },

    update: crudFactory.makeUpdate((person) => person),
  },
};
