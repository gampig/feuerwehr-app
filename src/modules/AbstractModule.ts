import { NavLink } from "@/models/NavLink";
import { Role } from "@/models/Auth";
import VueRouter from "vue-router";
import { Module, Store } from "vuex";

export default abstract class AbstractModule {
  protected store: Store<any>;
  protected router: VueRouter;
  abstract link: NavLink | null;

  constructor(store: Store<any>, router: VueRouter) {
    this.store = store;
    this.router = router;
  }

  abstract install(): void;

  onLogin(): void {
    if (this.isAuthorized()) {
      return this.load();
    } else {
      return this.unload();
    }
  }

  onLogout(): void {
    return this.unload();
  }

  isAuthorized(): boolean {
    return true;
  }

  protected abstract load(): any;

  protected abstract unload(): any;

  protected installStore(modules: { [index: string]: Module<any, any> }): void {
    for (const module in modules) {
      this.store.registerModule(module, modules[module]);
    }
  }

  protected isLoggedIn(): boolean {
    return this.store.state.auth.loggedIn;
  }

  protected hasAnyRole(requiredRoles: Role[]) {
    return this.store.getters["auth/hasAnyRole"](requiredRoles);
  }
}
