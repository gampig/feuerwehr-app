import firebase from "firebase/app";

import handleError from "@/utils/store/handleError";
import { defineStore } from "pinia";
import { User } from "@/models/User";

interface State {
  loading: boolean;
  initialized: boolean;
  users: User[];
}

async function request(
  method: string,
  subPath: string,
  requestBody?: BodyInit | null,
  expectedResponseCode: number = 200
) {
  const apiEndpoint = process.env?.VUE_APP_API_ENDPOINT;
  const idToken = await (firebase.auth().currentUser?.getIdToken() ??
    Promise.reject());
  const response = await fetch(`${apiEndpoint}/v1/benutzer${subPath}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: idToken,
    },
    body: requestBody,
  });
  if (response.status != expectedResponseCode) {
    throw Error(response.statusText);
  }
  return await response.json();
}

export const useUsersStore = defineStore("users", {
  state: (): State => ({
    loading: false,
    initialized: false,
    users: [],
  }),

  actions: {
    fetchAll() {
      this.setLoading(true);
      request("GET", "")
        .then((body: User[]) => {
          this.setUsers(body);
        })
        .catch(handleError)
        .finally(() => {
          this.setLoading(false);
        });
    },

    setLoading(loading: boolean) {
      this.loading = loading;
    },
    setUsers(users: User[]) {
      this.users = users;
      this.initialized = true;
    },
  },
});
