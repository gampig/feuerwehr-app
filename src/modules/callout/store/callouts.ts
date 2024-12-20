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
  callouts: Callout[] = [];
}

const crudFactory = new CrudFactory<State, Callout>("callouts");

function preprocessCallout(callout: Callout): Callout {
  callout.alarmTime = Number(callout.alarmTime);
  callout.endTime = Number(callout.endTime) || undefined;
  return callout;
}

function getFilterTime(): number {
  let filterTimeObject = moment();
  filterTimeObject = filterTimeObject.subtract(1, "year");
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
  },

  actions: <ActionTree<State, any>>{
    create: crudFactory.makeCreate(preprocessCallout),

    bind: firebaseAction(({ bindFirebaseRef, commit }) => {
      commit("setLoading", true);
      const filterTime = getFilterTime();
      return bindFirebaseRef(
        "callouts",
        firebase
          .database()
          .ref("callouts")
          .orderByChild("alarmTime")
          .startAt(filterTime)
      )
        .catch(handleError)
        .finally(() => {
          commit("setLoading", false);
        });
    }),
    unbind: firebaseAction(({ unbindFirebaseRef }) => {
      unbindFirebaseRef("callouts");
    }),
  },
};
