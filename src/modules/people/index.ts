import { Acl } from "@/acl";
import AbstractModule from "../AbstractModule";

export default class PeopleModule extends AbstractModule {
  install() {}

  isAuthorizedForLink() {
    return this.hasAnyRole(Acl.personenBearbeiten);
  }

  load() {}

  unload() {}
}
