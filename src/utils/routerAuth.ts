import { AppRoute } from "@/models/Route";
import { useAuthStore } from "@/stores/auth";
import { NavigationGuardNext } from "vue-router";

type AuthTypes = "requiresAuth";

export function requires(to: AppRoute, required: AuthTypes) {
  return to.matched.some(
    (record) => record.meta.auth && record.meta.auth[required]
  );
}

export function checkAuth(
  to: AppRoute,
  from: AppRoute,
  next: NavigationGuardNext<any>
) {
  const loggedIn = useAuthStore().loggedIn;

  if (requires(to, "requiresAuth")) {
    if (loggedIn === false) {
      next({
        name: "UserLogin",
        params:
          to.name === "UserLogin"
            ? { nextUrl: to.params.nextUrl }
            : { nextUrl: to.fullPath },
        replace: true,
      });
      return;
    }
  }

  next();
}
