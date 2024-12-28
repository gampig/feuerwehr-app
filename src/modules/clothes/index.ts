import { Acl } from "@/acl";
import AbstractModule from "../AbstractModule";
import store from "./store";

export default class ClothesModule extends AbstractModule {
  install() {
    this.installStore(store);
  }

  isAuthorized() {
    return this.hasAnyRole(Acl.kleiderverwaltung);
  }

  load() {
    return Promise.all([this.store.dispatch("orders/bindOrders")]);
  }

  unload() {
    return Promise.all([this.store.dispatch("orders/unbind")]);
  }
}
