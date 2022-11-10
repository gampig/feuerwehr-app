import { AllRoles } from "./models/User";

export abstract class Acl {
  static readonly mannschaftsbuch: AllRoles[] = [
    "ROLE_GROUPLEADER",
    "ROLE_VEHICLE",
  ];

  static readonly bereitschaftsliste: AllRoles[] = [
    "ROLE_GROUPLEADER",
    "ROLE_ALARM_PC",
  ];

  static readonly kleiderverwaltung: AllRoles[] = ["ROLE_MAINTAINER_CLOTHES"];

  static readonly personenBearbeiten: AllRoles[] = ["ROLE_GROUPLEADER"];

  static readonly datenexport: AllRoles[] = ["ROLE_GROUPLEADER"];
}
