import { AllRoles } from "@/models/User";
import { useAuthStore } from "@/stores/auth";

export default abstract class AbstractModule {
  protected authStore = useAuthStore();

  constructor() {
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

  protected isLoggedIn(): boolean {
    return this.authStore.loggedIn ?? false;
  }

  protected hasAnyRole(requiredRoles: AllRoles[]) {
    return this.authStore.hasAnyRole(requiredRoles);
  }
}
