import { AllRoles } from "@/models/User";
import AbstractModule from "../AbstractModule";
import route from "./router";
import store from "./store";

const requiredRoles: AllRoles[] = ["ROLE_GROUPLEADER", "ROLE_VEHICLE"];
const standbyRequiredRoles: AllRoles[] = ["ROLE_ALARM_PC"];

export default class CalloutModule extends AbstractModule {
  link = {
    title: "Einsatz",
    to: { name: "CalloutHome" },
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
    return this.store.dispatch("callouts/bind");
  }

  unload() {
    return Promise.all([
      this.store.dispatch("callouts/unbind"),
      this.store.dispatch("callout/unbind"),
    ]);
  }
}
