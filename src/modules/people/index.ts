import { Acl } from "@/acl";
import AbstractModule from "../AbstractModule";
import routes from "./router";
import store from "./store";

export default class PeopleModule extends AbstractModule {
  link = {
    title: "Personen",
    to: { name: "PeopleHome" },
    icon: "mdi-account-multiple",
    auth: () => this.isAuthorizedForLink(),
  };

  install() {
    routes.forEach((route) => this.router.addRoute(route));
    this.installStore(store);

    this.store.commit("navigation/addLinks", [this.link]);
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
