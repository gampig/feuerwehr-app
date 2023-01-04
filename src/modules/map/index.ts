import { Acl } from "@/acl";
import AbstractModule from "../AbstractModule";
import route from "./router";

export default class MapModule extends AbstractModule {
  install() {
    this.router.addRoute(route);
  }

  isAuthorized() {
    return this.hasAnyRole(Acl.karte);
  }

  load() {
  }

  unload() {
  }
}
