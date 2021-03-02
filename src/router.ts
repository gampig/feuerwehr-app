import Vue from "vue";
import VueRouter from "vue-router";
import checkAuth from "./utils/routerAuth";
import store from "./store";
import { AppRouteConfig } from "./models/Route";

Vue.use(VueRouter);

const routes: Array<AppRouteConfig> = [
  {
    path: "/",
    name: "Home",
    meta: { skipWaiting: true },
    component: () => import("@/views/Home.vue"),
  },
  {
    name: "UserLogin",
    path: "/benutzer/login",
    meta: { skipWaiting: true },
    component: () => import("./views/user/Login.vue"),
  },
  {
    name: "UserPasswordResetRequest",
    path: "/benutzer/" + encodeURI("passwort-zurücksetzen"),
    component: () => import("./views/user/PasswordResetRequest.vue"),
  },
  {
    name: "UserAction",
    path: "/benutzer/aktion",
    component: () => import("./views/user/Action.vue"),
  },
  {
    name: "UserChangePassword",
    path: "/benutzer/passwort",
    component: () => import("./views/user/ChangePassword.vue"),
    meta: { auth: { requiresAuth: true } },
  },
  {
    name: "DeviceSetup",
    path: "/benutzer/" + encodeURI("gerät"),
    component: () => import("./views/user/DeviceSetup.vue"),
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => checkAuth(to, from, next, store));

export default router;
