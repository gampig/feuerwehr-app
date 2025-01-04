import vehicleRoutes from "./vehicles/router";
import calloutRoute from "./callout/router";
import trainingRoutes from "./training/router";
import clothesRoutes from "./clothes/router";
import peopleRoutes from "./people/router";
import exporterRoutes from "./exporter/router";
import { RouteRecordRaw } from "vue-router";

class AppModules {
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

  onLogin() {}

  onLogout() {}
}

const modules = new AppModules();
export default modules;
