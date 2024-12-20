import {
  Client,
  Roles,
  AllRoles,
  LoginCredentials,
  UserSettings,
} from "../models/User";
import firebase from "firebase/compat/app";
import {
  AuthCredential,
  confirmPasswordReset,
  getAuth,
  onIdTokenChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  User,
} from "firebase/auth";
import { firebaseApp } from "@/firebase";
import cloneDeep from "lodash/cloneDeep";

import deviceService, { deviceId } from "@/services/device";

import handleError from "@/utils/store/handleError";
import { defineStore } from "pinia";

interface State {
  loading: boolean;
  loggedIn: boolean | null;
  user: User | null;
  vehicle?: string;
  roles?: Roles;
  reauthenticationRequired: boolean;
}

const auth = getAuth(firebaseApp);

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
      return onIdTokenChanged(auth, (user) => {
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
      return signInWithEmailAndPassword(auth, email, password).catch(
        (error) => {
          this.setLoading(false);
          handleError(error);
        }
      );
    },
    logout() {
      this.setLoading(true);
      return signOut(auth).catch((error) => {
        this.setLoading(false);
        handleError(error);
      });
    },
    reauthenticate(credential: AuthCredential) {
      this.setLoading(true);
      return getCurrentUser()
        .then((currentUser) =>
          reauthenticateWithCredential(currentUser, credential)
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
        .then((currentUser) => updatePassword(currentUser, newPassword))
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
      return sendPasswordResetEmail(auth, email).catch((error) =>
        handleError(error)
      );
    },
    reset({ code, newPassword }: { code: string; newPassword: string }) {
      return confirmPasswordReset(auth, code, newPassword).catch((error) =>
        handleError(error)
      );
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
    setUser(user: User | null) {
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

function getCurrentUser(): Promise<User> {
  return new Promise((resolve, reject) => {
    const currentUser = auth.currentUser;

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
