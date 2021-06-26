import { AllRoles } from "@/models/User";
import AbstractModule from "../AbstractModule";
import routes from "./router";
import store from "./store";

const requiredRoles: AllRoles[] = ["ROLE_MAINTAINER_CLOTHES"];

export default class ClothesModule extends AbstractModule {
  link = {
    title: "Kleidung",
    to: { name: "ClothesHome" },
    icon: "mdi-tshirt-crew",
    auth: () => this.isAuthorized(),
  };

  install() {
    routes.forEach((route) => this.router.addRoute(route));
    this.installStore(store);

    this.store.commit("navigation/addLinks", [this.link]);
  }

  isAuthorized() {
    return this.hasAnyRole(requiredRoles);
  }

  load() {
    return Promise.all([
      this.store.dispatch("clothingTypes/bindTypes"),
      this.store.dispatch("orders/bindOrders"),
    ]);
  }

  unload() {
    return Promise.all([
      this.store.dispatch("clothingTypes/unbind"),
      this.store.dispatch("orders/unbind"),
    ]);
  }
}
