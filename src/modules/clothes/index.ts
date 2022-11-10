import { Acl } from "@/acl";
import AbstractModule from "../AbstractModule";
import routes from "./router";
import store from "./store";

export default class ClothesModule extends AbstractModule {
  install() {
    routes.forEach((route) => this.router.addRoute(route));
    this.installStore(store);

    this.store.commit("navigation/addLinks", [
      {
        title: "Kleidung",
        to: { name: "ClothesHome" },
        icon: "mdi-tshirt-crew",
        auth: () => this.isAuthorized(),
      },
    ]);
  }

  isAuthorized() {
    return this.hasAnyRole(Acl.kleiderverwaltung);
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
