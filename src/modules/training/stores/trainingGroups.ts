import { Acl } from "@/acl";
import { trainingGroupsRef } from "@/firebase";
import { useAuthStore } from "@/stores/auth";
import handleError from "@/utils/store/handleError";
import { useDatabaseList } from "@/utils/store/vuefire";
import { set as dbSet } from "firebase/database";
import { defineStore } from "pinia";
import { computed } from "vue";
import { TrainingGroup } from "../models/Training";

export const useTrainingGroupsStore = defineStore("trainingGroups", () => {
  const trainingGroupsSource = computed(() =>
    useAuthStore().hasAnyRole(Acl.uebungenAnzeigen)
      ? trainingGroupsRef
      : undefined
  );
  const trainingGroups = useDatabaseList<TrainingGroup>(trainingGroupsSource);

  const loading = trainingGroups.pending;

  async function setGroups(value: TrainingGroup[]) {
    try {
      return await dbSet(trainingGroupsRef, value);
    } catch (error) {
      return handleError(error);
    }
  }

  return {
    trainingGroups,
    loading,
    promise: trainingGroups.promise,

    // Private variables
    trainingGroupsSource,

    setGroups,
  };
});
