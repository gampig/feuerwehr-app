import VehiclesModule from "./vehicles";
import CalloutModule from "./callout";
import ClothesModule from "./clothes";
import AbstractModule from "./AbstractModule";
import PeopleModule from "./people";
import ExporterModule from "./exporter";
import AppSettingsModule from "./appSettings";
import TrainingModule from "./training";
import vehicleRoutes from "./vehicles/router";
import calloutRoute from "./callout/router";
import trainingRoutes from "./training/router";
import clothesRoutes from "./clothes/router";
import peopleRoutes from "./people/router";
import exporterRoutes from "./exporter/router";
import { RouteRecordRaw } from "vue-router";

class AppModules {
  modules: AbstractModule[] = [];

  install() {
    this.modules = [
      new AppSettingsModule(),
      new VehiclesModule(),
      new CalloutModule(),
      new TrainingModule(),
      new ClothesModule(),
      new PeopleModule(),
      new ExporterModule(),
    ];
  }

  getRoutes(): Array<RouteRecordRaw> {
    return [
      vehicleRoutes,
      [calloutRoute],
      trainingRoutes,
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
