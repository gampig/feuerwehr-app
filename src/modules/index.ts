import VehiclesModule from "./vehicles";
import CalloutModule from "./callout";
import ClothesModule from "./clothes";
import { Store } from "vuex";
import VueRouter from "vue-router";
import AbstractModule from "./AbstractModule";
import PeopleModule from "./people";
import ExporterModule from "./exporter";

class AppModules {
  modules: AbstractModule[] = [];
  store?: Store<any>;

  install(store: Store<any>, router: VueRouter) {
    this.store = store;

    this.modules = [
      new VehiclesModule(store, router),
      new CalloutModule(store, router),
      new ClothesModule(store, router),
      new PeopleModule(store, router),
      new ExporterModule(store, router),
    ];
  }

  onLogin() {
    this.modules.forEach((module) => module.onLogin());
  }

  onLogout() {
    this.modules.forEach((module) => module.onLogout());
  }
}

const modules = new AppModules();
export default modules;
