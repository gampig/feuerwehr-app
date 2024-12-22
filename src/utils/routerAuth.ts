import { useAuthStore } from "@/stores/auth";
import {
  NavigationGuardNext,
  RouteLocationNormalizedGeneric,
  RouteLocationNormalizedLoadedGeneric,
} from "vue-router";

export function requiresAuth(to: RouteLocationNormalizedGeneric) {
  return to.matched.some(
    (record) => record.meta.auth && record.meta.auth.requiresAuth
  );
}

function getParamsForNext(to: RouteLocationNormalizedGeneric): {
  [key: string]: string | string[];
} {
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
  to: RouteLocationNormalizedGeneric,
  from: RouteLocationNormalizedLoadedGeneric,
  next: NavigationGuardNext
) {
  const loggedIn = useAuthStore().loggedIn;

  if (requiresAuth(to)) {
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
