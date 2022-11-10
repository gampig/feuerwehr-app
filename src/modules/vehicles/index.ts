import { Acl } from "@/acl";
import AbstractModule from "../AbstractModule";
import store from "./store";

export default class VehiclesModule extends AbstractModule {
  link = null;

  install() {
    this.installStore(store);
  }

  load() {
    if (this.hasAnyRole(Acl.mannschaftsbuch)) {
      return this.store.dispatch("vehicles/bindVehicles");
    } else {
      return this.store.dispatch("vehicles/unbind");
    }
  }

  unload() {
    return this.store.dispatch("vehicles/unbind");
  }
}
