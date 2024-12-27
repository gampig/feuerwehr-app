import { Acl } from "@/acl";
import AbstractModule from "../AbstractModule";
import { useVehiclesStore } from "./stores/vehicles";

export default class VehiclesModule extends AbstractModule {
  link = null;

  install() {}

  load() {
    if (this.hasAnyRole(Acl.mannschaftsbuch)) {
      return useVehiclesStore().bind();
    } else {
      return this.unload();
    }
  }

  unload() {
    return useVehiclesStore().unbind();
  }
}
