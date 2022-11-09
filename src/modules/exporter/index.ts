import { AllRoles } from "@/models/User";
import AbstractModule from "../AbstractModule";
import routes from "./router";

const requiredRoles: AllRoles[] = ["ROLE_GROUPLEADER"];

export default class ExporterModule extends AbstractModule {
  link = {
    title: "Datenexport",
    to: { name: "ExporterHome" },
    icon: "mdi-download",
    auth: () => this.isAuthorized(),
  };

  install() {
    routes.forEach((route) => this.router.addRoute(route));

    this.store.commit("navigation/addLinks", [this.link]);
  }

  isAuthorized() {
    return this.hasAnyRole(requiredRoles);
  }

  load() {}

  unload() {}
}
