export const rolesConfig: readonly {
  id: string;
  name: string;
  description?: string;
  hidden?: boolean;
}[] = [
  {
    id: "ROLE_USER",
    name: "Benutzer",
    hidden: true,
  },
  {
    id: "ROLE_ADMIN",
    name: "Administrator",
  },
  {
    id: "ROLE_MAINTAINER_CLOTHES",
    name: "Kleiderwart",
  },
  {
    id: "ROLE_VEHICLE",
    name: "Feuerwehrfahrzeug",
  },
  {
    id: "ROLE_ALARM_PC",
    name: "Alarm-PC",
  },
  {
    id: "ROLE_GROUPLEADER",
    name: "Gruppenführer",
  },
  {
    id: "ROLE_CALLOUT_EDITOR",
    name: "Einsatz-Bearbeiter",
  },
] as const;

export const roleConfigById = Object.fromEntries(
  rolesConfig.map((roleConfig) => [
    roleConfig.id,
    {
      name: roleConfig.name,
      description: roleConfig.description,
      hidden: roleConfig.hidden,
    },
  ])
);

export type AllRoles = (typeof rolesConfig)[number]["id"];

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
