import { AllRoles } from "@/models/User";
import AbstractModule from "../AbstractModule";
import routes from "./router";
import store from "./store";

const requiredRoles: AllRoles[] = ["ROLE_ADMIN", "ROLE_MAINTAINER_CLOTHES"];

export default class ClothesModule extends AbstractModule {
  link = {
    title: "Kleidung",
    to: { name: "ClothesHome" },
    icon: "mdi-tshirt-crew",
    auth: () => this.isAuthorized(),
  };

  install() {
    this.router.addRoutes(routes);
    this.installStore(store);

    this.store.commit("navigation/addLinks", [this.link]);
  }

  isAuthorized() {
    return this.hasAnyRole(requiredRoles);
  }

  load() {
    return Promise.all([
      this.store.dispatch("clothTypes/bindTypes"),
      this.store.dispatch("orders/bindOrders"),
    ]);
  }

  unload() {
    return Promise.all([
      this.store.dispatch("clothTypes/unbind"),
      this.store.dispatch("orders/unbind"),
    ]);
  }
}
