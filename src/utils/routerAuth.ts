import { AppRoute } from "@/models/Route";
import { useAuthStore } from "@/stores/auth";
import { NavigationGuardNext } from "vue-router";

type AuthTypes = "requiresAuth";

export function requires(to: AppRoute, required: AuthTypes) {
  return to.matched.some(
    (record) => record.meta.auth && record.meta.auth[required]
  );
}

function getParamsForNext(to: AppRoute): { [key: string]: string } {
  if (to.name !== "UserLogin") {
    return { nextUrl: to.fullPath };
  } else {
    if (to.params.nextUrl) {
      return { nextUrl: to.params.nextUrl };
    } else if (to.params.nextRouteName) {
      return { nextRouteName: to.params.nextRouteName };
    } else {
      return {};
    }
  }
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
        params: getParamsForNext(to),
        replace: true,
      });
      return;
    }
  }

  next();
}
