import { defineStore } from "pinia";
import { computed, shallowRef } from "vue";
import { useDatabaseList, VueDatabaseDocumentData } from "vuefire";
import {
  getDatabase,
  ref as dbRef,
  query,
  orderByChild,
  Query,
  push,
} from "firebase/database";
import { firebaseApp } from "@/firebase";
import { Callout } from "../models/Callout";
import handleError from "@/utils/store/handleError";
import moment from "moment";
import { formatDateTime } from "@/utils/dates";
import { deleteUndefinedProperties } from "@/utils/firebase/serialization";

export const useCalloutsStore = defineStore("callouts", () => {
  const db = getDatabase(firebaseApp);

  const calloutsRef = dbRef(db, "callouts");
  const calloutsQuery = query(calloutsRef, orderByChild("alarmTime"));
  const calloutsSource = shallowRef<Query>();
  const callouts = useDatabaseList<Callout>(calloutsSource);

  const loading = callouts.pending;

  const calloutsReversed = computed(() => [...callouts.value].reverse());
  const calloutsOfToday = computed(() => {
    const aDayAgo = moment().subtract(1, "day").unix();
    return callouts.value.filter((callout) => callout.alarmTime <= aDayAgo);
  });
  const calloutsBeforeToday = computed(() => {
    const aDayAgo = moment().subtract(1, "day").unix();
    return callouts.value
      .filter((callout) => callout.alarmTime <= aDayAgo)
      .reverse();
  });
  const calloutsWithFormattedDateTime = computed(() =>
    callouts.value.map((item) => {
      const callout: NonNullable<VueDatabaseDocumentData<Callout>> = {
        ...(item as Callout),
        id: item.id,
      };
      callout.alarmTimeFormatted = formatDateTime(callout.alarmTime);
      if (callout.endTime) {
        callout.endTimeFormatted = formatDateTime(callout.endTime);
      }
      return callout;
    })
  );

  function bind() {
    calloutsSource.value = calloutsQuery;
  }

  function unbind() {
    calloutsSource.value = undefined;
  }

  async function create(newCallout: Callout) {
    try {
      const value = deleteUndefinedProperties(newCallout);
      return await push(calloutsRef, value);
    } catch (error) {
      return handleError(error);
    }
  }

  return {
    callouts,
    loading,
    calloutsReversed,
    calloutsOfToday,
    calloutsBeforeToday,
    calloutsWithFormattedDateTime,
    bind,
    unbind,
    create,
  };
});
