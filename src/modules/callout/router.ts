import { RouteRecordRaw } from "vue-router";

export default [
  {
    path: encodeURI("/einsätze"),
    name: "CalloutHome",
    component: () => import("./views/Home.vue"),
    meta: { auth: { requiresAuth: true } },
    children: [
      {
        name: "CalloutList",
        path: "liste",
        component: () => import("./views/List.vue"),
      },

      {
        path: "mannschaft",
        name: "CrewCallouts",
        meta: { skipWaiting: true },
        component: () => import("./views/crew/SelectCallout.vue"),
      },

      {
        name: "SelectStandby",
        path: "bereitschaft",
        component: () => import("./views/Standby.vue"),
      },

      {
        name: "CalloutReport",
        path: "bericht",
        component: () => import("./views/Report.vue"),
      },
    ],
  },

  {
    path: encodeURI("/einsätze/mannschaft/:callout_id"),
    redirect: { name: "CrewEditCallout" },
    component: () => import("./views/Crew.vue"),
    children: [
      {
        name: "CrewEditCallout",
        path: "bearbeiten",
        component: () => import("./views/crew/UpdateCallout.vue"),
      },
      {
        name: "CrewVehicles",
        path: "",
        component: () => import("./views/crew/SelectVehicle.vue"),
      },
      {
        name: "CrewVehicleDetails",
        path: ":vehicle_id?/fahrzeug",
        component: () => import("./views/crew/VehicleDetails.vue"),
      },
      {
        name: "CrewPeople",
        path: ":vehicle_id?/mannschaft",
        component: () => import("./views/crew/SelectCrew.vue"),
      },
    ],
  },
] satisfies RouteRecordRaw[];
