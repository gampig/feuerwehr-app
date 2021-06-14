import { AllRoles } from "@/models/User";
import AbstractModule from "../AbstractModule";
import store from "./store";

const requiredRoles: { [type: string]: AllRoles[] } = {
  vehicles: ["ROLE_GROUPLEADER", "ROLE_VEHICLE"],
  people: [
    "ROLE_GROUPLEADER",
    "ROLE_VEHICLE",
    "ROLE_MAINTAINER_CLOTHES",
    "ROLE_ALARM_PC",
  ],
};

export default class FireDepartmentModule extends AbstractModule {
  link = null;

  install() {
    this.installStore(store);
  }

  load() {
    let vehiclePromise = null;
    if (this.hasAnyRole(requiredRoles.vehicles)) {
      vehiclePromise = this.store.dispatch("vehicles/bindVehicles");
    } else {
      vehiclePromise = this.store.dispatch("vehicles/unbind");
    }

    let peoplePromise = null;
    if (this.hasAnyRole(requiredRoles.people)) {
      peoplePromise = this.store.dispatch("people/bindPeople");
    } else {
      peoplePromise = this.store.dispatch("people/unbind");
    }

    return Promise.all([vehiclePromise, peoplePromise]);
  }

  unload() {
    return Promise.all([
      this.store.dispatch("vehicles/unbind"),
      this.store.dispatch("people/unbind"),
    ]);
  }
}
