import { RouteRecordRaw } from "vue-router";

export default [
  {
    path: encodeURI("/events"),
    name: "EventsHome",
    meta: { auth: { requiresAuth: true }, skipWaiting: true },
    component: () => import("./views/List.vue"),
  },
] satisfies RouteRecordRaw[];
