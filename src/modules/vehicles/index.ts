import { AllRoles } from "@/models/User";
import AbstractModule from "../AbstractModule";
import store from "./store";

const requiredRoles: AllRoles[] = ["ROLE_GROUPLEADER", "ROLE_VEHICLE"];

export default class VehiclesModule extends AbstractModule {
  link = null;

  install() {
    this.installStore(store);
  }

  load() {
    if (this.hasAnyRole(requiredRoles)) {
      return this.store.dispatch("vehicles/bindVehicles");
    } else {
      return this.store.dispatch("vehicles/unbind");
    }
  }

  unload() {
    return this.store.dispatch("vehicles/unbind");
  }
}
