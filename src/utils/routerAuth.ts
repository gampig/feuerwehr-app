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

function getNextAfterLogin(
  to: RouteLocationNormalizedGeneric
): string | undefined {
  if (to.name !== "UserLogin") {
    return to.fullPath;
  } else {
    if (typeof to.query.next === "string") {
      return to.query.next;
    } else {
      return undefined;
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
        query: {
          next: getNextAfterLogin(to),
        },
        replace: true,
      });
      return;
    }
  }

  next();
}
