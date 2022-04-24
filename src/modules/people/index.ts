import { AllRoles } from "@/models/User";
import AbstractModule from "../AbstractModule";
import routes from "./router";

const requiredRoles: AllRoles[] = ["ROLE_GROUPLEADER"];

export default class PeopleModule extends AbstractModule {
  link = {
    title: "Personen",
    to: { name: "PeopleHome" },
    icon: "mdi-account-multiple",
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
