import { AppRoute } from "@/models/Route";
import { NavigationGuardNext } from "vue-router";
import { Store } from "vuex";

type AuthTypes = "requiresAuth";

export function requires(to: AppRoute, required: AuthTypes) {
  return to.matched.some(
    (record) => record.meta.auth && record.meta.auth[required]
  );
}

export default function (
  to: AppRoute,
  from: AppRoute,
  next: NavigationGuardNext<any>,
  store: Store<any>
) {
  const loggedIn = store.state.auth.loggedIn;

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
