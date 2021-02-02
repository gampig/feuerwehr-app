export default {
  path: encodeURI("/einsätze"),
  component: () => import("./components/Layout.vue"),
  meta: { auth: { requiresAuth: true } },
  children: [
    {
      name: "CalloutHome",
      path: "",
      meta: { skipWaiting: true },
      component: () => import("./views/Home.vue"),
    },
    {
      name: "CalloutList",
      path: "liste",
      component: () => import("./views/List.vue"),
    },
    {
      name: "CalloutCreate",
      path: "erstellen",
      component: () => import("./views/Create.vue"),
    },
    {
      name: "CalloutUpdate",
      path: "bearbeiten/:id",
      component: () => import("./views/Update.vue"),
    },
    {
      name: "CalloutShow",
      path: "anzeigen/:id",
      component: () => import("./views/Show.vue"),
    },
    {
      name: "CrewCallouts",
      path: "mannschaft",
      component: () => import("./views/crew/SelectCallout.vue"),
    },
    {
      name: "CrewEditCallout",
      path: "mannschaft/:callout_id?/bearbeiten",
      component: () => import("./views/crew/UpdateCallout.vue"),
    },
    {
      name: "SelectStandby",
      path: "bereitschaft",
      redirect: { name: "StandbyCallout" },
      component: () => import("./views/Standby.vue"),
      children: [
        { name: "StandbyCallout", path: "" },
        { name: "StandbyPeople", path: ":id" },
      ],
    },
  ],
};
