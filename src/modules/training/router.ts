export default [
  {
    path: encodeURI("/übungen"),
    name: "TrainingHome",
    meta: { auth: { requiresAuth: true }, skipWaiting: true },
    component: () => import("./views/List.vue"),
  },
  {
    path: encodeURI("/übungen/:id"),
    name: "TrainingShow",
    meta: { auth: { requiresAuth: true } },
    component: () => import("./views/Show.vue"),
  },
];
