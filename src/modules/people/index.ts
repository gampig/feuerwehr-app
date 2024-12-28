import { Acl } from "@/acl";
import AbstractModule from "../AbstractModule";
import { usePeopleStore } from "./stores/people";

export default class PeopleModule extends AbstractModule {
  install() {}

  isAuthorizedForLink() {
    return this.hasAnyRole(Acl.personenBearbeiten);
  }

  load() {
    return usePeopleStore().bind();
  }

  unload() {
    return usePeopleStore().unbind();
  }
}
