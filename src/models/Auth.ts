export interface LoginCredentials {
  email: string;
  password: string;
}

export type Role =
  | "ROLE_ADMIN"
  | "ROLE_GROUPLEADER"
  | "ROLE_MAINTAINER_CLOTHES"
  | "ROLE_VEHICLE"
  | "ROLE_ALARM_PC";

export interface Client {
  lastOnline: Date;
  version: string;
}

export interface Configuration {
  roles?: Role[];
  vehicle?: string;
}

export interface Profile {
  displayName?: string | null;
  photoURL?: string | null;
}
