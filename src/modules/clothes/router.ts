export default [
  {
    path: "/kleidung",
    name: "ClothesHome",
    redirect: { name: "ClothesOrders" },
    meta: { auth: { requiresAuth: true }, skipWaiting: true },
    component: () => import("./views/Home.vue"),
    children: [
      {
        name: "ClothesOrders",
        path: "bestellungen",
        component: () => import("./views/Orders.vue"),
      },
      {
        name: "ClothesTypes",
        path: "typen",
        component: () => import("./views/ClothingTypes.vue"),
      },
    ],
  },

  {
    name: "ClothesStorage",
    path: "/kleidung/lager/:id",
    component: () => import("./views/Storage.vue"),
  },
];
