import { defineStore } from "pinia";
import { computed } from "vue";
import { VueDatabaseDocumentData } from "vuefire";
import {
  getDatabase,
  ref as dbRef,
  query,
  orderByChild,
  push,
  remove as dbRemove,
  child,
} from "firebase/database";
import { firebaseApp } from "@/firebase";
import { Callout } from "../models/Callout";
import handleError from "@/utils/store/handleError";
import moment from "moment";
import { formatDateTime } from "@/utils/dates";
import { deleteUndefinedProperties } from "@/utils/firebase/serialization";
import { useAuthStore } from "@/stores/auth";
import { Acl } from "@/acl";
import { useDatabaseList } from "@/utils/store/vuefire";

export const useCalloutsStore = defineStore("callouts", () => {
  const db = getDatabase(firebaseApp);

  const calloutsRef = dbRef(db, "callouts");
  const crewRef = dbRef(db, "crew");

  const calloutsQuery = query(calloutsRef, orderByChild("alarmTime"));
  const calloutsSource = computed(() =>
    useAuthStore().hasAnyRole(Acl.einsaetzeAnzeigen) ? calloutsQuery : undefined
  );
  const callouts = useDatabaseList<Callout>(calloutsSource);

  const loading = callouts.pending;

  const calloutsReversed = computed(() => [...callouts.value].reverse());
  const calloutsOfToday = computed(() => {
    const aDayAgo = moment().subtract(1, "day").unix();
    return callouts.value
      .filter((callout) => callout.alarmTime > aDayAgo)
      .reverse();
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

  async function create(newCallout: Callout) {
    try {
      const value = deleteUndefinedProperties(newCallout);
      return await push(calloutsRef, value);
    } catch (error) {
      return handleError(error);
    }
  }

  async function remove(calloutId: string) {
    await dbRemove(child(crewRef, calloutId));
    return await dbRemove(child(calloutsRef, calloutId));
  }

  return {
    callouts,
    loading,
    calloutsReversed,
    calloutsOfToday,
    calloutsBeforeToday,
    calloutsWithFormattedDateTime,

    // Private variables
    calloutsSource,

    create,
    remove,
  };
});
