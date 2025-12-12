import { AllRoles } from "./models/User";

export abstract class Acl {
  static readonly geraetEinrichten: AllRoles[] = [
    "ROLE_ADMIN",
    "ROLE_CHIEF",
    "ROLE_GROUPLEADER",
  ];

  static readonly mannschaftsbuch: AllRoles[] = [
    "ROLE_ADMIN",
    "ROLE_CHIEF",
    "ROLE_GROUPLEADER",
    "ROLE_VEHICLE",
  ];

  static readonly bereitschaftsliste: AllRoles[] = [
    "ROLE_ADMIN",
    "ROLE_CHIEF",
    "ROLE_GROUPLEADER",
    "ROLE_ALARM_PC",
    "ROLE_VEHICLE",
  ];

  static readonly alarmPc: AllRoles[] = ["ROLE_ALARM_PC"];

  static readonly einsaetzeAnzeigen: AllRoles[] = [
    ...this.mannschaftsbuch,
    ...this.bereitschaftsliste,
  ];
  static readonly alleEinsaetzeAnzeigen: AllRoles[] = [
    "ROLE_ADMIN",
    "ROLE_CHIEF",
    "ROLE_GROUPLEADER",
  ];
  static readonly alleEinsaetzeBearbeiten: AllRoles[] =
    Acl.alleEinsaetzeAnzeigen;

  static readonly einsatzLoeschen: AllRoles[] = [
    "ROLE_ADMIN",
    "ROLE_CHIEF",
    "ROLE_GROUPLEADER",
  ];

  static readonly einsatzberichtErstellen: AllRoles[] = [
    "ROLE_ADMIN",
    "ROLE_CHIEF",
  ];
  static readonly einsatzberichtVerteilerBearbeiten: AllRoles[] = [
    "ROLE_ADMIN",
    "ROLE_CHIEF",
  ];

  static readonly uebungenAnzeigen: AllRoles[] = ["ROLE_ADMIN", "ROLE_CHIEF"];
  static readonly alleUebungenAnzeigen: AllRoles[] = [
    "ROLE_ADMIN",
    "ROLE_CHIEF",
  ];
  static readonly uebungImmerBearbeiten: AllRoles[] = [
    "ROLE_ADMIN",
    "ROLE_CHIEF",
  ];
  static readonly uebungGruppenBearbeiten: AllRoles[] = [
    "ROLE_ADMIN",
    "ROLE_CHIEF",
  ];

  static readonly feuerwehrGeraete: AllRoles[] = [
    "ROLE_ADMIN",
    "ROLE_CHIEF",
    "ROLE_GROUPLEADER",
    "ROLE_VEHICLE",
  ];

  static readonly kleiderverwaltung: AllRoles[] = [
    "ROLE_ADMIN",
    "ROLE_MAINTAINER_CLOTHES",
  ];

  static readonly personenAnzeigen: AllRoles[] = ["ROLE_USER"];
  static readonly personenBearbeiten: AllRoles[] = [
    "ROLE_ADMIN",
    "ROLE_CHIEF",
    "ROLE_PEOPLE_EDITOR",
  ];

  static readonly datenexport: AllRoles[] = ["ROLE_GROUPLEADER"];

  static readonly benutzerVerwalten: AllRoles[] = ["ROLE_ADMIN"];
}
