import { Acl } from "@/acl";
import { trainingsRef } from "@/firebase";
import { useAuthStore } from "@/stores/auth";
import { deleteUndefinedProperties } from "@/utils/firebase/serialization";
import handleError from "@/utils/store/handleError";
import { useDatabaseList } from "@/utils/store/vuefire";
import {
  child,
  remove as dbRemove,
  orderByChild,
  push,
  query,
  set,
} from "firebase/database";
import moment from "moment";
import { defineStore } from "pinia";
import { computed } from "vue";
import { Training } from "../models/Training";

export const useTrainingsStore = defineStore("trainings", () => {
  const trainingsQuery = query(trainingsRef, orderByChild("startTime"));
  const trainingsSource = computed(() =>
    useAuthStore().hasAnyRole(Acl.uebungenAnzeigen) ? trainingsQuery : undefined
  );
  const trainings = useDatabaseList<Training>(trainingsSource);

  const loading = trainings.pending;

  const trainingsReversed = computed(() => [...trainings.value].reverse());
  const trainingsOfToday = computed(() => {
    const aDayAgo = moment().subtract(1, "day").unix();
    return trainings.value
      .filter((training) => (training.startTime ?? 0) > aDayAgo)
      .reverse();
  });

  async function create(newTraining: Training) {
    try {
      const value = deleteUndefinedProperties(newTraining);
      return await push(trainingsRef, value);
    } catch (error) {
      return handleError(error);
    }
  }

  async function remove(trainingId: string) {
    return await dbRemove(child(trainingsRef, trainingId));
  }

  async function updateField(trainingId: string, field: string, value: any) {
    try {
      const trainingRef = child(trainingsRef, trainingId);
      const fieldRef = child(trainingRef, field);
      if (value === undefined) {
        return await dbRemove(fieldRef);
      }
      return await set(fieldRef, value);
    } catch (error) {
      return handleError(error);
    }
  }

  async function addParticipant(
    trainingId: string,
    participantName: string,
    participantGroup?: string
  ) {
    try {
      const trainingRef = child(trainingsRef, trainingId);
      const participantsRef = child(trainingRef, "participants");
      const newParticipant = {
        name: participantName,
        group: participantGroup,
      };
      const value = deleteUndefinedProperties(newParticipant);
      return await push(participantsRef, value);
    } catch (error) {
      return handleError(error);
    }
  }

  async function removeParticipant(trainingId: string, participantId: string) {
    try {
      const participantRef = child(
        trainingsRef,
        `${trainingId}/participants/${participantId}`
      );
      return await dbRemove(participantRef);
    } catch (error) {
      return handleError(error);
    }
  }

  return {
    trainings,
    loading,
    promise: trainings.promise,
    trainingsReversed,
    trainingsOfToday,

    // Private variables
    trainingsSource,

    create,
    remove,
    updateField,
    addParticipant,
    removeParticipant,
  };
});
