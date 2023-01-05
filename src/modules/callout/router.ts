export default {
  path: encodeURI("/einsätze"),
  redirect: { name: "CrewCallouts" },
  component: () => import("./components/Layout.vue"),
  meta: { auth: { requiresAuth: true } },
  children: [
    {
      name: "CalloutList",
      path: "liste",
      component: () => import("./views/List.vue"),
    },
    {
      name: "CalloutShow",
      path: "anzeigen/:id",
      component: () => import("./views/Show.vue"),
    },

    {
      path: "mannschaft",
      component: () => import("./views/Crew.vue"),
      children: [
        {
          name: "CrewCallouts",
          path: "",
          meta: { skipWaiting: true },
          component: () => import("./views/crew/SelectCallout.vue"),
        },
        {
          name: "CrewEditCallout",
          path: ":callout_id?/bearbeiten",
          component: () => import("./views/crew/UpdateCallout.vue"),
        },
        {
          name: "CrewVehicles",
          path: ":callout_id",
          component: () => import("./views/crew/SelectVehicle.vue"),
        },
        {
          name: "CrewVehicleDetails",
          path: ":callout_id/:vehicle_id?/fahrzeug",
          component: () => import("./views/crew/VehicleDetails.vue"),
        },
        {
          name: "CrewPeople",
          path: ":callout_id/:vehicle_id?/mannschaft",
          component: () => import("./views/crew/SelectCrew.vue"),
        },
      ],
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
