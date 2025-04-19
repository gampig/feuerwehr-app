import { RouteRecordRaw } from "vue-router";

export default [
  {
    path: "/personen",
    name: "PeopleHome",
    meta: { auth: { requiresAuth: true }, skipWaiting: true },
    component: () => import("./views/Home.vue"),
  },
] satisfies RouteRecordRaw[];
