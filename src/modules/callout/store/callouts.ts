import CrudFactory from "@/utils/firebase/CrudFactory";
import { firebaseAction } from "vuexfire";
import firebase from "firebase/app";
import moment from "moment";
import { formatDateTime } from "@/utils/dates";
import handleError from "@/utils/store/handleError";
import { Callout } from "../models/Callout";
import { ActionTree, GetterTree, MutationTree } from "vuex";

class State {
  loading = false;
  allCalloutsLoaded = false;
  callouts: Callout[] = [];
}

const crudFactory = new CrudFactory<State, Callout>("callouts");

function preprocessCallout(callout: Callout): Callout {
  callout.alarmTime = Number(callout.alarmTime);
  callout.endTime = Number(callout.endTime) || undefined;
  return callout;
}

function getFilterTime(loadAll: boolean): number {
  let filterTimeObject = moment();

  if (loadAll) {
    filterTimeObject = filterTimeObject.subtract(1, "year");
  } else {
    filterTimeObject = filterTimeObject.subtract(1, "day");
  }

  return filterTimeObject.unix();
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
    calloutsBeforeToday: (state) => {
      if (!state.allCalloutsLoaded) {
        return [];
      }
      const aDayAgo = moment().subtract(1, "day").unix();
      return state.callouts
        .filter((callout) => callout.alarmTime <= aDayAgo)
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

    loadedAllCallouts(state) {
      state.allCalloutsLoaded = true;
    },
    removedAllCallouts(state) {
      state.allCalloutsLoaded = false;
    },
  },

  actions: <ActionTree<State, any>>{
    create: crudFactory.makeCreate(preprocessCallout),

    bind: firebaseAction(
      (
        { bindFirebaseRef, commit },
        { loadAllCallouts }: { loadAllCallouts: boolean }
      ) => {
        commit("setLoading", true);

        const filterTime = getFilterTime(loadAllCallouts);

        return bindFirebaseRef(
          "callouts",
          firebase
            .database()
            .ref("callouts")
            .orderByChild("alarmTime")
            .startAt(filterTime)
        )
          .then((ref) => {
            commit("setLoading", false);
            if (loadAllCallouts) {
              commit("loadedAllCallouts");
            } else {
              commit("removedAllCallouts");
            }
            return ref;
          })
          .catch((error) => {
            commit("setLoading", false);
            commit("removedAllCallouts");
            return handleError(commit, error);
          });
      }
    ),
    unbind: firebaseAction(({ unbindFirebaseRef, commit }) => {
      commit("removedAllCallouts");
      unbindFirebaseRef("callouts");
    }),
  },
};
