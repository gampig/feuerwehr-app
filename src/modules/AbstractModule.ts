import { AllRoles } from "@/models/User";
import { useAuthStore } from "@/stores/auth";
import { Module, Store } from "vuex";

export default abstract class AbstractModule {
  protected authStore = useAuthStore();
  protected store: Store<any>;

  constructor(store: Store<any>) {
    this.store = store;

    this.install();
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
    return this.authStore.loggedIn ?? false;
  }

  protected hasAnyRole(requiredRoles: AllRoles[]) {
    return this.authStore.hasAnyRole(requiredRoles);
  }
}
