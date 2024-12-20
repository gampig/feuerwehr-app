import firebase from "firebase/compat/app";
import { defineStore } from "pinia";
import { Person } from "../models/Person";
import handleError from "@/utils/store/handleError";

interface State {
  loading: boolean;
  people: Person[];
}

export const usePeopleStore = defineStore("people", {
  state: (): State => ({
    loading: false,
    people: [],
  }),

  getters: {
    peopleReversed: (state) => [...state.people].reverse(),
    peopleByActivity: (state) =>
      [...state.people].sort(
        (a, b) => (b.recentCalloutsCount || 0) - (a.recentCalloutsCount || 0)
      ),
  },

  actions: {
    async bindPeople() {
      this.loading = true;
      try {
        const snapshot = await firebase.database().ref("people").get();
        const people: Person[] = [];
        snapshot.forEach((child) => {
          people.push({
            id: child.ref.key,
            ...child.val(),
          });
        });
        this.people = people;
      } catch (error) {
        handleError(error);
      } finally {
        this.loading = false;
      }
    },

    unbind() {
      this.people = [];
    },

    async update(person: Person) {
      const key = person.id;
      const firebasePerson: any = person;
      delete firebasePerson["id"];
      try {
        return await firebase
          .database()
          .ref("people")
          .child(key)
          .update(firebasePerson);
      } catch (error) {
        handleError(error);
      }
    },
  },
});
