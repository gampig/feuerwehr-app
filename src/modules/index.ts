import VehiclesModule from "./vehicles";
import CalloutModule from "./callout";
import ClothesModule from "./clothes";
import { Store } from "vuex";
import AbstractModule from "./AbstractModule";
import PeopleModule from "./people";
import ExporterModule from "./exporter";
import AppSettingsModule from "./appSettings";
import vehicleRoutes from "./vehicles/router";
import calloutRoute from "./callout/router";
import clothesRoutes from "./clothes/router";
import peopleRoutes from "./people/router";
import exporterRoutes from "./exporter/router";
import { AppRouteConfig } from "@/models/Route";

class AppModules {
  modules: AbstractModule[] = [];
  store?: Store<any>;

  install(store: Store<any>) {
    this.store = store;

    this.modules = [
      new AppSettingsModule(store),
      new VehiclesModule(store),
      new CalloutModule(store),
      new ClothesModule(store),
      new PeopleModule(store),
      new ExporterModule(store),
    ];
  }

  getRoutes(): Array<AppRouteConfig> {
    return [
      vehicleRoutes,
      [calloutRoute],
      clothesRoutes,
      peopleRoutes,
      exporterRoutes,
    ].flat();
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
