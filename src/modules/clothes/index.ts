import { Acl } from "@/acl";
import AbstractModule from "../AbstractModule";

export default class ClothesModule extends AbstractModule {
  install() {}

  isAuthorized() {
    return this.hasAnyRole(Acl.kleiderverwaltung);
  }

  load() {}

  unload() {}
}
