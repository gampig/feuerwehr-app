export default {
  name: "Map",
  path: "/karte",
  component: () => import("./views/Map.vue"),
  meta: { auth: { requiresAuth: true } }
};
