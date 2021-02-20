import { GetterTree, MutationTree, ActionTree, ActionContext } from "vuex";
import {
  Profile,
  Configuration as UserSettings,
  Client,
  Role,
  LoginCredentials,
} from "../../models/Auth";
import firebase from "firebase/app";
import { firebaseAction } from "vuexfire";
import cloneDeep from "lodash/cloneDeep";

import deviceService, { deviceId } from "@/services/device";

import { showError } from "@/utils/notifications";
import handleError from "@/utils/store/handleError";

class State {
  loading = true;
  loggedIn = false;
  user: firebase.User | null = null;
  userSettings: UserSettings | null = null;
  reauthenticationRequired = false;
}

function onLogin(context: ActionContext<any, any>, user: firebase.User) {
  const userCopy = cloneDeep(user);
  context.commit("setUser", userCopy);
  context.dispatch("bind");
}

function onSettingsBound(
  context: ActionContext<any, any>,
  ref: firebase.database.DataSnapshot
) {
  context.commit("login");
  return ref;
}

function onLogout(context: ActionContext<any, any>) {
  context.commit("logout");
  context.dispatch("unbind");

  const deviceCred = deviceService.get();
  if (deviceCred) {
    context.dispatch("login", deviceCred);
  }
}

const authModule = {
  namespaced: true,

  state: new State(),

  getters: <GetterTree<State, any>>{
    isAdmin: (state) => {
      if (state.userSettings && state.userSettings.roles) {
        const roles = state.userSettings.roles;
        if (roles.some((role) => role === "ROLE_ADMIN" || "ROLE_GROUPLEADER")) {
          return true;
        }
      }
      return false;
    },

    hasAnyRole: (state) => (requiredRoles: Role[]) => {
      if (!requiredRoles) {
        return true;
      }

      if (!state.userSettings || state.userSettings.roles === undefined) {
        return false;
      }

      const userRoles: Role[] = state.userSettings.roles;

      return (
        userRoles &&
        requiredRoles.some((reqRole) => userRoles.includes(reqRole))
      );
    },
  },

  actions: <ActionTree<State, any>>{
    init(context) {
      return firebase.auth().onIdTokenChanged((user) => {
        if (user) {
          onLogin(context, user);
        } else {
          onLogout(context);
        }
      });
    },
    bind: firebaseAction((context) => {
      if (!context.state.user) {
        showError("Benutzer muss angemeldet sein.");
      } else {
        return context
          .bindFirebaseRef(
            "userSettings",
            firebase.database().ref("users/" + context.state.user.uid)
          )
          .then((ref) => onSettingsBound(context, ref));
      }
    }),
    unbind: firebaseAction(({ unbindFirebaseRef }) => {
      return unbindFirebaseRef("userSettings");
    }),

    login({ commit }, { email, password }: LoginCredentials) {
      commit("loading");
      return firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .catch((error) => {
          commit("done");
          handleError(commit, error);
        });
    },
    logout({ commit }) {
      commit("loading");
      return firebase
        .auth()
        .signOut()
        .catch((error) => {
          commit("done");
          handleError(commit, error);
        });
    },
    register(
      { commit },
      {
        profile,
        email,
        password,
      }: {
        profile: Profile;
        email: string;
        password: string;
      }
    ) {
      commit("loading");
      return firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          if (userCredential.user) {
            return userCredential.user.updateProfile(profile);
          } else {
            throw new Error("Benutzer konnte nicht registriert werden.");
          }
        })
        .catch((error) => handleError(commit, error))
        .finally(() => commit("done"));
    },
    reauthenticate({ commit }, credential: firebase.auth.AuthCredential) {
      commit("loading");
      return getCurrentUser()
        .then((currentUser) =>
          currentUser.reauthenticateWithCredential(credential)
        )
        .then(
          () => {
            commit("reauthenticated");
          },
          (error) => handleError(commit, error)
        )
        .finally(() => commit("done"));
    },

    updatePassword({ commit }, newPassword: string) {
      return getCurrentUser()
        .then((currentUser) => currentUser.updatePassword(newPassword))
        .catch((error) => handleError(commit, error));
    },
    updateUserSettings({ commit, state }, payload: UserSettings) {
      return getCurrentUser()
        .then((currentUser) =>
          firebase
            .database()
            .ref("users/" + currentUser.uid)
            .update(payload)
        )
        .catch((error) => handleError(commit, error));
    },
    updateClientMetadata({ commit, state }, payload: Client) {
      return getCurrentUser()
        .then((currentUser) =>
          firebase
            .database()
            .ref("userClients/" + currentUser.uid)
            .child(deviceId)
            .update(payload)
        )
        .catch((error) => handleError(commit, error));
    },
    updateRoles({ commit, state }, payload: Role[]) {
      return getCurrentUser()
        .then((currentUser) =>
          firebase
            .database()
            .ref("users/" + currentUser.uid)
            .child("roles")
            .set(payload)
        )
        .catch((error) => handleError(commit, error));
    },
    updateProfile({ commit }, payload: Profile) {
      return getCurrentUser()
        .then((currentUser) => currentUser.updateProfile(payload))
        .then(
          () => {
            commit("updateProfile", payload);
          },
          (error) => handleError(commit, error)
        );
    },

    requestReset({ commit }, email: string) {
      return firebase
        .auth()
        .sendPasswordResetEmail(email)
        .catch((error) => handleError(commit, error));
    },
    reset(
      { commit },
      { code, newPassword }: { code: string; newPassword: string }
    ) {
      return firebase
        .auth()
        .confirmPasswordReset(code, newPassword)
        .catch((error) => handleError(commit, error));
    },
  },

  mutations: <MutationTree<State>>{
    loading(state) {
      state.loading = true;
    },
    done(state) {
      state.loading = false;
    },
    login(state) {
      state.loggedIn = true;
      state.loading = false;
    },
    logout(state) {
      state.loggedIn = false;
      state.user = null;
      state.loading = false;
    },
    setUser(state, user: firebase.User) {
      state.user = user;
    },
    setUserSettings(state, userSettings: UserSettings) {
      state.userSettings = userSettings;
    },
    updateProfile(state, payload: Profile) {
      if (state.user) {
        state.user.displayName =
          payload.displayName === undefined ? null : payload.displayName;
        state.user.photoURL =
          payload.photoURL === undefined ? null : payload.photoURL;
      }
    },
    reauthenticated(state) {
      state.reauthenticationRequired = false;
    },
    reauthenticationRequired(state) {
      state.reauthenticationRequired = true;
    },
  },
};

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

export default authModule;
