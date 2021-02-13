export interface LoginCredentials {
  email: string;
  password: string;
}

type AllRoles =
  | "ROLE_ADMIN"
  | "ROLE_GROUPLEADER"
  | "ROLE_MAINTAINER_CLOTHES"
  | "ROLE_VEHICLE"
  | "ROLE_ALARM_PC";

export type Roles = Array<AllRoles>;

export interface Client {
  lastOnline?: Date;
  version?: string;
}

export interface Configuration {
  roles?: Roles;
  vehicle?: string;
}

export interface Profile {
  displayName?: string | null;
  photoURL?: string | null;
}
