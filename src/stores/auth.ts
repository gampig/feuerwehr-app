import {
  Client,
  Roles,
  AllRoles,
  LoginCredentials,
  UserSettings,
} from "../models/User";
import {
  AuthCredential,
  confirmPasswordReset,
  getAuth,
  onIdTokenChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword as authUpdatePassword,
  User,
} from "firebase/auth";
import { child, ref as dbRef, getDatabase, update } from "firebase/database";
import { firebaseApp } from "@/firebase";
import cloneDeep from "lodash/cloneDeep";

import deviceService, { deviceId } from "@/services/device";

import handleError from "@/utils/store/handleError";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { deleteUndefinedProperties } from "@/utils/firebase/serialization";
import { useDatabaseObject } from "@/utils/store/vuefire";

export const useAuthStore = defineStore("auth", () => {
  const auth = getAuth(firebaseApp);
  const db = getDatabase(firebaseApp);

  const user = ref<User | null>();
  const reauthenticationRequired = ref(false);

  const userSettingsSource = computed(() =>
    user.value?.uid ? child(dbRef(db, "users"), user.value.uid) : undefined
  );
  const userSettings = useDatabaseObject<UserSettings>(userSettingsSource);

  const loggedIn = computed(() => {
    if (user.value === null) {
      return false;
    } else if (user.value && userSettings.value) {
      return true;
    } else {
      return undefined;
    }
  });

  const vehicle = computed(() => userSettings.value?.vehicle);

  const roles = computed<Roles | undefined>(() =>
    userSettings.value?.roles !== undefined
      ? { ...userSettings.value.roles, ROLE_USER: true }
      : undefined
  );

  function hasAnyRole(requiredRoles: AllRoles[]) {
    if (requiredRoles.length == 0) {
      return true;
    } else if (!roles.value) {
      return false;
    } else {
      const userRoles: Roles = roles.value;
      return requiredRoles.some((reqRole) => userRoles[reqRole]);
    }
  }

  onIdTokenChanged(auth, (newUser) => {
    if (newUser) {
      const userCopy = cloneDeep(newUser);
      user.value = userCopy;
    } else {
      user.value = null;
      const deviceCred = deviceService.get();
      if (deviceCred) {
        login(deviceCred);
      }
    }
  });

  function login({ email, password }: LoginCredentials) {
    return signInWithEmailAndPassword(auth, email, password).catch((error) => {
      handleError(error);
    });
  }

  function logout() {
    return signOut(auth).catch((error) => {
      handleError(error);
    });
  }

  function reauthenticate(credential: AuthCredential) {
    return getCurrentUser()
      .then((currentUser) =>
        reauthenticateWithCredential(currentUser, credential)
      )
      .then(
        () => {
          reauthenticationRequired.value = false;
        },
        (error) => handleError(error)
      );
  }

  function cancelReauthentication() {
    reauthenticationRequired.value = false;
  }

  function updatePassword(newPassword: string) {
    return getCurrentUser()
      .then((currentUser) => authUpdatePassword(currentUser, newPassword))
      .catch((error) => {
        if (error?.code === "auth/requires-recent-login") {
          reauthenticationRequired.value = true;
        }

        handleError(error);
      });
  }

  function updateClientMetadata(payload: Client) {
    return getCurrentUser()
      .then((currentUser) =>
        update(
          child(child(dbRef(db, "userClients"), currentUser.uid), deviceId),
          deleteUndefinedProperties(payload)
        )
      )
      .catch((error) => handleError(error));
  }

  function requestReset(email: string) {
    return sendPasswordResetEmail(auth, email).catch((error) =>
      handleError(error)
    );
  }

  function reset({ code, newPassword }: { code: string; newPassword: string }) {
    return confirmPasswordReset(auth, code, newPassword).catch((error) =>
      handleError(error)
    );
  }

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

  return {
    loggedIn,
    user,
    vehicle,
    reauthenticationRequired,

    // Private variables
    userSettings,
    userSettingsSource,

    hasAnyRole,
    login,
    logout,
    reauthenticate,
    cancelReauthentication,
    updatePassword,
    updateClientMetadata,
    requestReset,
    reset,
  };
});
