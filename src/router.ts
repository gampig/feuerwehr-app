import VueRouter from "vue-router";
import { checkAuth } from "./utils/routerAuth";
import { AppRouteConfig } from "./models/Route";

const routes: Array<AppRouteConfig> = [
  {
    path: "/",
    name: "Home",
    meta: { auth: { requiresAuth: true }, skipWaiting: true },
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

  // For testing
  {
    name: "FakeError",
    path: "/test/fehler",
    meta: { auth: { requiresAuth: true } },
    component: () => import("./views/test/FakeError.vue"),
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => checkAuth(to, from, next));

export default router;
