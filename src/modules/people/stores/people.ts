import { Acl } from "@/acl";
import { peopleRef } from "@/firebase";
import { useAuthStore } from "@/stores/auth";
import { deleteUndefinedProperties } from "@/utils/firebase/serialization";
import handleError from "@/utils/store/handleError";
import { useDatabaseList } from "@/utils/store/vuefire";
import { child, update as dbUpdate } from "firebase/database";
import { defineStore } from "pinia";
import { computed } from "vue";
import { Person } from "../models/Person";

export const usePeopleStore = defineStore("people", () => {
  const peopleSource = computed(() =>
    useAuthStore().hasAnyRole(Acl.personenAnzeigen) ? peopleRef : undefined
  );
  const people = useDatabaseList<Person>(peopleSource);
  const loading = people.pending;

  const peopleReversed = computed(() => [...people.value].reverse());
  const peopleByActivity = computed(() =>
    [...people.value].sort(
      (a, b) => (b.recentCalloutsCount || 0) - (a.recentCalloutsCount || 0)
    )
  );

  async function update(id: string, person: Person) {
    const firebasePerson = deleteUndefinedProperties(person);
    try {
      return await dbUpdate(child(peopleRef, id), firebasePerson);
    } catch (error) {
      handleError(error);
    }
  }

  return {
    people,
    loading,
    promise: people.promise,
    peopleReversed,
    peopleByActivity,

    // Private variables
    peopleSource,

    update,
  };
});
