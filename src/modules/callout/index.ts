import { Acl } from "@/acl";
import AbstractModule from "../AbstractModule";

export default class CalloutModule extends AbstractModule {
  install() {}

  isAuthorized() {
    return this.hasAnyRole(Acl.einsaetzeAnzeigen);
  }

  load() {}

  unload() {}
}
