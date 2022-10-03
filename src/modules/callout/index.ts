import { AllRoles } from "@/models/User";
import AbstractModule from "../AbstractModule";
import route from "./router";
import store from "./store";

const requiredRoles: AllRoles[] = ["ROLE_GROUPLEADER", "ROLE_VEHICLE"];
const standbyRequiredRoles: AllRoles[] = ["ROLE_GROUPLEADER", "ROLE_ALARM_PC"];

export default class CalloutModule extends AbstractModule {
  link = {
    title: "Mannschaft",
    to: { name: "CrewCallouts" },
    icon: "mdi-alarm-light",
    auth: () => this.hasAnyRole(requiredRoles),
  };
  navLinks = [
    this.link,
    {
      title: "Bereitschaft",
      to: { name: "SelectStandby" },
      icon: "mdi-alarm-light",
      auth: () => this.hasAnyRole(standbyRequiredRoles),
    },
    {
      title: "Einsätze",
      to: { name: "CalloutList" },
      icon: "mdi-alarm-light",
      auth: () => this.hasAnyRole(requiredRoles),
    },
  ];

  install() {
    this.router.addRoute(route);
    this.installStore(store);

    this.store.commit("navigation/addLinks", this.navLinks);
  }

  isAuthorized() {
    return this.hasAnyRole([...requiredRoles, ...standbyRequiredRoles]);
  }

  load() {
    const loadAllCallouts = this.store.state.callouts.allCalloutsLoaded;
    return this.store.dispatch("callouts/bind", { loadAllCallouts });
  }

  unload() {
    return Promise.all([
      this.store.dispatch("callouts/unbind"),
      this.store.dispatch("callout/unbind"),
    ]);
  }
}
