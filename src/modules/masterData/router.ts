import { RouteRecordRaw } from "vue-router";

export default [
  {
    path: "/stammdaten",
    name: "MasterDataHome",
    redirect: { name: "PeopleHome" },
    meta: { auth: { requiresAuth: true }, skipWaiting: true },
    component: () => import("./views/Home.vue"),
    children: [
      {
        path: "personen",
        name: "PeopleHome",
        component: () => import("./views/PeopleHome.vue"),
      },
    ],
  },
] satisfies RouteRecordRaw[];
