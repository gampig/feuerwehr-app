import { RouteRecordRaw } from "vue-router";

export default [
  {
    path: "/export",
    name: "ExporterHome",
    meta: { auth: { requiresAuth: true }, skipWaiting: true },
    component: () => import("./views/Home.vue"),
  },
] satisfies RouteRecordRaw[];
