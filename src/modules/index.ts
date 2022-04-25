import VehiclesModule from "./vehicles";
import CalloutModule from "./callout";
import ClothesModule from "./clothes";
import { Store } from "vuex";
import VueRouter from "vue-router";
import AbstractModule from "./AbstractModule";
import PeopleModule from "./people";

class AppModules {
  modules: { [index: string]: AbstractModule } = {};
  store?: Store<any>;

  install(store: Store<any>, router: VueRouter) {
    this.store = store;

    this.modules.vehicles = new VehiclesModule(store, router);
    this.modules.vehicles.install();

    this.modules.callout = new CalloutModule(store, router);
    this.modules.callout.install();

    this.modules.clothes = new ClothesModule(store, router);
    this.modules.clothes.install();

    this.modules.people = new PeopleModule(store, router);
    this.modules.people.install();
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
