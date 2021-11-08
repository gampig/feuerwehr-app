import FireDepartmentModule from "./fireDepartment";
import CalloutModule from "./callout";
import ClothesModule from "./clothes";
import { Store } from "vuex";
import VueRouter from "vue-router";
import AbstractModule from "./AbstractModule";
import MaintenanceTeamModule from "./maintenanceTeam";

class AppModules {
  modules: { [index: string]: AbstractModule } = {};
  store?: Store<any>;

  install(store: Store<any>, router: VueRouter) {
    this.store = store;

    this.modules.fireDepartment = new FireDepartmentModule(store, router);
    this.modules.fireDepartment.install();

    this.modules.callout = new CalloutModule(store, router);
    this.modules.callout.install();

    this.modules.maintenanceTeam = new MaintenanceTeamModule(store, router);
    this.modules.maintenanceTeam.install();

    this.modules.clothes = new ClothesModule(store, router);
    this.modules.clothes.install();
  }

  onLogin() {
    Object.values(this.modules).forEach((module) => module.onLogin());
  }

  onLogout() {
    Object.values(this.modules).forEach((module) => module.onLogout());
  }

  getStartPage() {
    if (this.store?.state.auth.userSettings?.roles?.ROLE_ALARM_PC) {
      return { name: "SelectStandby" };
    }

    return (
      this.getLink(this.modules.callout) || this.getLink(this.modules.clothes)
    );
  }

  getLink(module: AbstractModule) {
    if (module.isAuthorized()) {
      return module.link?.to;
    } else {
      return undefined;
    }
  }
}

const modules = new AppModules();
export default modules;
