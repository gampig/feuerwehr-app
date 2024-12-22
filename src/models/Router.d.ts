import "vue-router";

export {};

declare module "vue-router" {
  interface RouteMeta {
    skipWaiting?: boolean;
    auth?: {
      requiresAuth: boolean;
    };
  }
}
