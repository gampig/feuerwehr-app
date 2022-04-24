import { AllRoles } from "@/models/User";
import AbstractModule from "../AbstractModule";
import store from "./store";

const requiredRoles: { [type: string]: AllRoles[] } = {
  vehicles: ["ROLE_GROUPLEADER", "ROLE_VEHICLE"],
};

export default class FireDepartmentModule extends AbstractModule {
  link = null;

  install() {
    this.installStore(store);
  }

  load() {
    if (this.hasAnyRole(requiredRoles.vehicles)) {
      return this.store.dispatch("vehicles/bindVehicles");
    } else {
      return this.store.dispatch("vehicles/unbind");
    }
  }

  unload() {
    return this.store.dispatch("vehicles/unbind");
  }
}
