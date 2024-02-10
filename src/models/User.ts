export const rolesConfig: readonly {
  name: string;
  description: string;
  hidden?: boolean;
}[] = [
  {
    name: "ROLE_USER",
    description: "Benutzer",
    hidden: true,
  },
  {
    name: "ROLE_ADMIN",
    description: "Administrator",
  },
  {
    name: "ROLE_MAINTAINER_CLOTHES",
    description: "Kleiderwart",
  },
  {
    name: "ROLE_VEHICLE",
    description: "Feuerwehrfahrzeug",
  },
  {
    name: "ROLE_ALARM_PC",
    description: "Alarm-PC",
  },
  {
    name: "ROLE_GROUPLEADER",
    description: "Gruppenführer",
  },
] as const;

export const roleConfigById = Object.fromEntries(
  rolesConfig.map((roleConfig) => [
    roleConfig.name,
    { description: roleConfig.description, hidden: roleConfig.hidden },
  ])
);

export type AllRoles = (typeof rolesConfig)[number]["name"];

export type Roles = Partial<Record<AllRoles, boolean>>;

export interface Client {
  lastOnline?: string;
  version?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserSettings {
  roles?: Roles;
  vehicle?: string;
}

export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  disabled: boolean;
  vehicle: string | null;
  roles: AllRoles[];
}
