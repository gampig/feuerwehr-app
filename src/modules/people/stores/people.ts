import { defineStore } from "pinia";
import { Person } from "../models/Person";
import handleError from "@/utils/store/handleError";
import { deleteUndefinedProperties } from "@/utils/firebase/serialization";
import { useDatabaseList } from "vuefire";
import { computed, shallowRef } from "vue";
import {
  DatabaseReference,
  getDatabase,
  ref as dbRef,
  update as dbUpdate,
  child,
} from "firebase/database";
import { firebaseApp } from "@/firebase";

export const usePeopleStore = defineStore("people", () => {
  const db = getDatabase(firebaseApp);
  const peopleRef = dbRef(db, "people");
  const peopleSource = shallowRef<DatabaseReference>();
  const people = useDatabaseList<Person>(peopleSource);
  const loading = people.pending;

  const peopleReversed = computed(() => [...people.value].reverse());
  const peopleByActivity = computed(() =>
    [...people.value].sort(
      (a, b) => (b.recentCalloutsCount || 0) - (a.recentCalloutsCount || 0)
    )
  );

  function bind() {
    peopleSource.value = peopleRef;
  }

  function unbind() {
    peopleSource.value = undefined;
  }

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
    peopleReversed,
    peopleByActivity,
    bind,
    unbind,
    update,
  };
});
