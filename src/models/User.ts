export interface LoginCredentials {
  email: string;
  password: string;
}

export type AllRoles =
  | "ROLE_GROUPLEADER"
  | "ROLE_MAINTAINER"
  | "ROLE_MAINTAINER_CLOTHES"
  | "ROLE_VEHICLE"
  | "ROLE_ALARM_PC";

export type Roles = Partial<Record<AllRoles, boolean>>;

export interface Client {
  lastOnline?: string;
  version?: string;
}

export interface UserSettings {
  comment?: string;
  lastOnline?: string;
  roles?: { [role: string]: boolean };
  clients?: { [key: string]: Client };
}
