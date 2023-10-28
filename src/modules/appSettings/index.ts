import { Acl } from "@/acl";
import AbstractModule from "../AbstractModule";
import { useAppSettingsStore } from "./stores/appSettings";

export default class AppSettingsModule extends AbstractModule {
  private appSettingsStore = useAppSettingsStore();

  install() {}

  load() {
    if (this.hasAnyRole(Acl.feuerwehrGeraete)) {
      return this.appSettingsStore.bindFeuerwehrGeraeteSettings();
    }
  }

  unload() {
    return this.appSettingsStore.unbind();
  }
}
