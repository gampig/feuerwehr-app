import {
  Client,
  Roles,
  AllRoles,
  LoginCredentials,
  UserSettings,
} from "../models/User";
import firebase from "firebase/compat/app";
import cloneDeep from "lodash/cloneDeep";

import deviceService, { deviceId } from "@/services/device";

import handleError from "@/utils/store/handleError";
import { defineStore } from "pinia";

interface State {
  loading: boolean;
  loggedIn: boolean | null;
  user: firebase.User | null;
  vehicle?: string;
  roles?: Roles;
  reauthenticationRequired: boolean;
}

export const useAuthStore = defineStore("auth", {
  state: (): State => ({
    loading: true,
    loggedIn: null,
    user: null,
    reauthenticationRequired: false,
  }),

  getters: {
    hasAnyRole: (state) => (requiredRoles: AllRoles[]) => {
      if (requiredRoles.length == 0) {
        return true;
      } else if (!state.roles) {
        return false;
      } else {
        const userRoles: Roles = state.roles;
        return requiredRoles.some((reqRole) => userRoles[reqRole]);
      }
    },
  },

  actions: {
    init() {
      return firebase.auth().onIdTokenChanged((user) => {
        if (user) {
          const userCopy = cloneDeep(user);
          this.setUser(userCopy);
          if (this.user === null) return;
          firebase
            .database()
            .ref("users/" + this.user.uid)
            .once("value", (snapshot) => {
              const userSettings = snapshot.val() as UserSettings;
              this.setUserSettings(userSettings);
              this.setLoggedIn(true);
              this.setLoading(false);
            });
        } else {
          this.setLoggedIn(false);
          this.setUser(null);
          this.setLoading(false);
          this.setUserSettings();

          const deviceCred = deviceService.get();
          if (deviceCred) {
            this.login(deviceCred);
          }
        }
      });
    },

    login({ email, password }: LoginCredentials) {
      this.setLoading(true);
      return firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((value) => {
          this.setLoggedIn(null);
          return value;
        })
        .catch((error) => {
          this.setLoading(false);
          handleError(error);
        });
    },
    logout() {
      this.setLoading(true);
      return firebase
        .auth()
        .signOut()
        .catch((error) => {
          this.setLoading(false);
          handleError(error);
        });
    },
    reauthenticate(credential: firebase.auth.AuthCredential) {
      this.setLoading(true);
      return getCurrentUser()
        .then((currentUser) =>
          currentUser.reauthenticateWithCredential(credential)
        )
        .then(
          () => {
            this.setReauthenticationRequired(false);
          },
          (error) => handleError(error)
        )
        .finally(() => this.setLoading(false));
    },

    updatePassword(newPassword: string) {
      return getCurrentUser()
        .then((currentUser) => currentUser.updatePassword(newPassword))
        .catch((error) => {
          if (error?.code === "auth/requires-recent-login") {
            this.setReauthenticationRequired(true);
          }

          handleError(error);
        });
    },
    updateClientMetadata(payload: Client) {
      return getCurrentUser()
        .then((currentUser) =>
          firebase
            .database()
            .ref("userClients/" + currentUser.uid)
            .child(deviceId)
            .update(payload)
        )
        .catch((error) => handleError(error));
    },

    requestReset(email: string) {
      return firebase
        .auth()
        .sendPasswordResetEmail(email)
        .catch((error) => handleError(error));
    },
    reset({ code, newPassword }: { code: string; newPassword: string }) {
      return firebase
        .auth()
        .confirmPasswordReset(code, newPassword)
        .catch((error) => handleError(error));
    },

    setLoading(loading: boolean) {
      this.loading = loading;
    },
    setLoggedIn(loggedIn: boolean | null) {
      this.loggedIn = loggedIn;
    },
    setReauthenticationRequired(reauthenticationRequired: boolean) {
      this.reauthenticationRequired = reauthenticationRequired;
    },
    setUser(user: firebase.User | null) {
      this.user = user;
    },
    setUserSettings(this, userSettings?: UserSettings) {
      this.roles = userSettings?.roles;
      if (this.roles) {
        this.roles.ROLE_USER = true;
      }

      this.vehicle = userSettings?.vehicle;
    },
  },
});

function getCurrentUser(): Promise<firebase.User> {
  return new Promise((resolve, reject) => {
    const currentUser = firebase.auth().currentUser;

    if (currentUser) {
      resolve(currentUser);
    } else {
      reject(
        new Error(
          "Benutzer ist nicht mehr angemeldet: Bitte Seite neu laden oder neu anmelden."
        )
      );
    }
  });
}
