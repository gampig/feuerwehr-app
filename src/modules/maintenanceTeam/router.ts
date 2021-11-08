export default {
  path: encodeURI("/gerätewart"),
  component: () => import("./components/Layout.vue"),
  meta: { auth: { requiresAuth: true } },
  children: [
    {
      name: "MaintenanceTeamHome",
      path: "",
      meta: { skipWaiting: true },
      component: () => import("./views/Home.vue"),
    },
  ],
};
