import { Acl } from "@/acl";
import AbstractModule from "../AbstractModule";
import routes from "./router";
import store from "./store";

export default class PeopleModule extends AbstractModule {
  install() {
    routes.forEach((route) => this.router.addRoute(route));
    this.installStore(store);
  }

  isAuthorizedForLink() {
    return this.hasAnyRole(Acl.personenBearbeiten);
  }

  load() {
    return this.store.dispatch("people/bindPeople");
  }

  unload() {
    return this.store.dispatch("people/unbind");
  }
}
