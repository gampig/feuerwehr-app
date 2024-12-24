import { RouteLocationAsPath, RouteLocationAsRelative } from "vue-router";

export interface NavLink {
  title: string;
  icon?: string;

  to?: string | RouteLocationAsRelative | RouteLocationAsPath;
  href?: string;
  click?: (event: MouseEvent | KeyboardEvent) => void;

  auth: boolean;
}
