import { AllRoles } from "./models/User";

export abstract class Acl {
  static readonly geraetEinrichten: AllRoles[] = ["ROLE_GROUPLEADER"];

  static readonly mannschaftsbuch: AllRoles[] = [
    "ROLE_GROUPLEADER",
    "ROLE_VEHICLE",
  ];

  static readonly bereitschaftsliste: AllRoles[] = [
    "ROLE_GROUPLEADER",
    "ROLE_ALARM_PC",
    "ROLE_VEHICLE",
  ];

  static readonly alarmPc: AllRoles[] = ["ROLE_ALARM_PC"];

  static readonly einsaetzeAnzeigen: AllRoles[] = [
    ...this.mannschaftsbuch,
    ...this.bereitschaftsliste,
  ];
  static readonly alleEinsaetzeAnzeigen: AllRoles[] = ["ROLE_GROUPLEADER"];
  static readonly alleEinsaetzeBearbeiten: AllRoles[] =
    Acl.alleEinsaetzeAnzeigen;

  static readonly einsatzLoeschen: AllRoles[] = ["ROLE_GROUPLEADER"];

  static readonly uebungenAnzeigen: AllRoles[] = ["ROLE_GROUPLEADER"];

  static readonly feuerwehrGeraete: AllRoles[] = [
    "ROLE_GROUPLEADER",
    "ROLE_VEHICLE",
  ];

  static readonly kleiderverwaltung: AllRoles[] = ["ROLE_MAINTAINER_CLOTHES"];

  static readonly personenAnzeigen: AllRoles[] = ["ROLE_USER"];
  static readonly personenBearbeiten: AllRoles[] = ["ROLE_PEOPLE_EDITOR"];

  static readonly datenexport: AllRoles[] = ["ROLE_GROUPLEADER"];

  static readonly benutzerVerwalten: AllRoles[] = ["ROLE_ADMIN"];
}
