import { Acl } from "@/acl";
import AbstractModule from "../AbstractModule";

export default class ExporterModule extends AbstractModule {
  install() {}

  isAuthorized() {
    return this.hasAnyRole(Acl.datenexport);
  }

  load() {}

  unload() {}
}
