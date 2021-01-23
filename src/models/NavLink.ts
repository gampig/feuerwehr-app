import { Location } from "vue-router";

export interface NavLink {
  title: string;
  icon?: string;

  to?: string | Location;
  href?: string;
  click?: (event: MouseEvent | KeyboardEvent) => void;

  auth?: () => boolean;
}
