import { Acl } from "@/acl";
import AbstractModule from "../AbstractModule";
import store from "./store";

export default class AppSettingsModule extends AbstractModule {
  install() {
    this.installStore(store);
  }

  load() {
    if (this.hasAnyRole(Acl.feuerwehrGeraete)) {
      return this.store.dispatch("appSettings/bindFeuerwehrGeraeteSettings");
    }
  }

  unload() {
    return this.store.dispatch("appSettings/unbind");
  }
}
