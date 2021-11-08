import { AllRoles } from "@/models/User";
import AbstractModule from "../AbstractModule";
import route from "./router";

const requiredRoles: AllRoles[] = ["ROLE_MAINTAINER"];

export default class MaintenanceTeamModule extends AbstractModule {
  link = {
    title: "Gerätewart",
    to: { name: "MaintenanceTeamHome" },
    icon: "mdi-hammer-wrench",
    auth: () => this.hasAnyRole(requiredRoles),
  };

  install() {
    this.router.addRoute(route);
    //this.installStore(store);

    this.store.commit("navigation/addLinks", [this.link]);
  }

  isAuthorized() {
    return this.hasAnyRole(requiredRoles);
  }

  load() {}

  unload() {}
}
