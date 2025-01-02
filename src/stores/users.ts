import handleError from "@/utils/store/handleError";
import { defineStore } from "pinia";
import createClient, { Middleware } from "openapi-fetch";
import { paths } from "@/models/FeuerwehrAppApi";
import { User } from "@/models/User";
import { firebaseApp } from "@/firebase";
import { getAuth } from "firebase/auth";

interface State {
  loading: boolean;
  initialized: boolean;
  users: User[];
}

const auth = getAuth(firebaseApp);

const apiFirebaseAuthMiddleware: Middleware = {
  async onRequest(req) {
    const accessToken = await auth.currentUser?.getIdToken();
    if (accessToken !== undefined) {
      req.headers.set("Authorization", `Bearer ${accessToken}`);
    } else {
      throw new Error();
    }
    return req;
  },
};

const client = createClient<paths>({
  baseUrl: `${import.meta.env.VITE_API_ENDPOINT}/v1`,
  headers: {
    Accept: "application/json",
  },
});
client.use(apiFirebaseAuthMiddleware);

export const useUsersStore = defineStore("users", {
  state: (): State => ({
    loading: false,
    initialized: false,
    users: [],
  }),

  actions: {
    fetchAll() {
      this.setLoading(true);
      client
        .GET("/benutzer")
        .then(({ data, error }) => {
          if (error) {
            handleError(new Error("Konnte Benutzer nicht laden"));
          } else if (data) {
            this.setUsers(data);
          }
        })
        .catch(handleError)
        .finally(() => {
          this.setLoading(false);
        });
    },

    updateDisplayName(uid: string, displayName: string | null) {
      this.setLoading(true);
      return client
        .POST("/benutzer/{userId}/name", {
          body: {
            displayName: displayName ?? undefined,
          },
          params: {
            path: {
              userId: uid,
            },
          },
        })
        .then((value) => {
          if (value.error) {
            handleError(new Error("Konnte Namen nicht ändern"));
          } else {
            const user = this.users.find((user) => user.uid === uid);
            if (user) {
              user.displayName = displayName ?? undefined;
            }
          }
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
