import { create } from "@/utils/firebase/dbCRUD";
import { firebaseAction } from "vuexfire";
import serialize from "@/utils/firebase/serialize";
import firebase from "firebase/app";
import moment from "moment";
import { formatDateTime } from "@/utils/dates";
import handleError from "@/utils/store/handleError";
import { Callout } from "../models/Callout";
import { ActionTree, GetterTree, MutationTree } from "vuex";

class State {
  loading = false;
  callouts: Callout[] = [];
}

export default {
  namespaced: true,

  state: new State(),

  getters: <GetterTree<State, any>>{
    calloutsReversed: (state) => [...state.callouts].reverse(),
    calloutsOfToday: (state) => {
      const aDayAgo = moment().subtract(1, "day").unix();

      return state.callouts
        .filter((callout) => callout.alarmTime > aDayAgo)
        .reverse();
    },
    calloutsWithFormattedDateTime: (state) =>
      state.callouts.map((item) => {
        const callout = { ...item };
        callout.alarmTimeFormatted = formatDateTime(callout.alarmTime);
        if (callout.endTime) {
          callout.endTimeFormatted = formatDateTime(callout.endTime);
        }
        return callout;
      }),
  },

  mutations: <MutationTree<State>>{
    setLoading(state, loading: boolean) {
      state.loading = loading;
    },
  },

  actions: <ActionTree<State, any>>{
    create: create("callouts"),

    bind: firebaseAction(({ bindFirebaseRef, commit }) => {
      commit("setLoading", true);

      const filterTime = moment().subtract(1, "year").unix();

      return bindFirebaseRef(
        "callouts",
        firebase
          .database()
          .ref("callouts")
          .orderByChild("alarmTime")
          .startAt(filterTime),
        { serialize }
      )
        .then((ref) => {
          commit("setLoading", false);
          return ref;
        })
        .catch((error) => {
          commit("setLoading", false);
          return handleError(commit, error);
        });
    }),
    unbind: firebaseAction(({ unbindFirebaseRef }) => {
      unbindFirebaseRef("callouts");
    }),
  },
};
