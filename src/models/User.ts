export interface LoginCredentials {
  email: string;
  password: string;
}

export type AllRoles =
  | "ROLE_USER"
  | "ROLE_ADMIN"
  | "ROLE_GROUPLEADER"
  | "ROLE_MAINTAINER_CLOTHES"
  | "ROLE_VEHICLE"
  | "ROLE_ALARM_PC";

export type Roles = Partial<Record<AllRoles, boolean>>;

export interface Client {
  lastOnline?: string;
  version?: string;
}

export interface UserSettings {
  roles?: Roles;
  vehicle?: string;
}
