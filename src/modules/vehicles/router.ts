export default [
  {
    path: "/fahrzeuge",
    name: "VehiclesHome",
    meta: { auth: { requiresAuth: true }, skipWaiting: true },
    component: () => import("./views/Home.vue"),
  },
];
