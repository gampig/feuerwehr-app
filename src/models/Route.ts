import { Route, RouteConfig } from "vue-router";

type RouteMeta = {
  skipWaiting?: boolean;
  auth?: {
    requiresAuth: boolean;
  };
};

export type AppRouteConfig = RouteConfig & {
  meta?: RouteMeta;
};

export interface AppRoute extends Route {
  meta?: RouteMeta;
}
