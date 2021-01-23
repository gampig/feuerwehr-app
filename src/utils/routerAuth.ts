import { AppRoute } from "@/models/Route";
import { NavigationGuardNext } from "vue-router";
import { Store } from "vuex";

function requires(to: AppRoute, required: string) {
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
  const user = store.state.auth.user;

  if (requires(to, "requiresAuth")) {
    if (!user) {
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
