import { RouteRecordRaw } from "vue-router";

export default [
  {
    path: "/personen",
    name: "PeopleHome",
    meta: { auth: { requiresAuth: true }, skipWaiting: true },
    component: () => import("./views/PeopleHome.vue"),
  },
] satisfies RouteRecordRaw[];
