import { Acl } from "@/acl";
import AbstractModule from "../AbstractModule";
import routes from "./router";

export default class ExporterModule extends AbstractModule {
  install() {
    routes.forEach((route) => this.router.addRoute(route));
  }

  isAuthorized() {
    return this.hasAnyRole(Acl.datenexport);
  }

  load() {}

  unload() {}
}
