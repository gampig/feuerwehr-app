import { GetterTree, MutationTree, ActionTree, ActionContext } from "vuex";
import {
  Client,
  Roles,
  AllRoles,
  LoginCredentials,
  UserSettings,
} from "../../models/User";
import firebase from "firebase/app";
import cloneDeep from "lodash/cloneDeep";

import deviceService, { deviceId } from "@/services/device";

import handleError from "@/utils/store/handleError";

class State {
  loading = true;
  loggedIn: boolean | null = null;
  user: firebase.User | null = null;
  vehicle?: string;
  roles?: Roles;
  reauthenticationRequired = false;
}

function onLogin(context: ActionContext<any, any>, user: firebase.User) {
  const userCopy = cloneDeep(user);
  context.commit("setUser", userCopy);
  firebase
    .database()
    .ref("users/" + context.state.user.uid)
    .once("value", (snapshot) => {
      const userSettings = snapshot.val() as UserSettings;
      context.commit("setUserSettings", userSettings);
      onLoginComplete(context);
    });
}

function onLoginComplete(context: ActionContext<any, any>) {
  context.commit("login");
}

function onLogout(context: ActionContext<any, any>) {
  context.commit("logout");
  context.commit("setUserSettings");

  const deviceCred = deviceService.get();
  if (deviceCred) {
    context.dispatch("login", deviceCred);
  }
}

const authModule = {
  namespaced: true,

  state: new State(),

  getters: <GetterTree<State, any>>{
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

    login({ commit }, { email, password }: LoginCredentials) {
      commit("loading");
      return firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .catch((error) => {
          commit("done");
          handleError(error);
        });
    },
    logout({ commit }) {
      commit("loading");
      return firebase
        .auth()
        .signOut()
        .catch((error) => {
          commit("done");
          handleError(error);
        });
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
          (error) => handleError(error)
        )
        .finally(() => commit("done"));
    },

    updatePassword({ commit }, newPassword: string) {
      return getCurrentUser()
        .then((currentUser) => currentUser.updatePassword(newPassword))
        .catch((error) => {
          if (error?.code === "auth/requires-recent-login") {
            commit("reauthenticationRequired");
          }

          handleError(error);
        });
    },
    updateClientMetadata(context, payload: Client) {
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

    requestReset(context, email: string) {
      return firebase
        .auth()
        .sendPasswordResetEmail(email)
        .catch((error) => handleError(error));
    },
    reset(
      context,
      { code, newPassword }: { code: string; newPassword: string }
    ) {
      return firebase
        .auth()
        .confirmPasswordReset(code, newPassword)
        .catch((error) => handleError(error));
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
    setUserSettings(state, userSettings?: UserSettings) {
      state.roles = userSettings?.roles;
      if (state.roles) {
        state.roles.ROLE_USER = true;
      }

      state.vehicle = userSettings?.vehicle;
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
