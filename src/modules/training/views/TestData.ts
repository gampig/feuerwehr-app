import { Training } from "../models/Training";

export const groups = [
  "Zug",
  "Jugend",
  "Kinderfeuerwehr",
  "Gruppe 1",
  "Neue Aktive",
  "Atemschutz",
  "Maschinisten",
  "UG-ÖEL",
  "Notfallteam",
  "Bootsführer",
  "Gruppenführer",
  "Gerätewart",
  "Leistungsprüfung",
  "Lehrgang",
  "Anderes",
];

export const trainings: Training[] = [
  {
    id: "randomId",
    creationTime: 1734633000,
    startTime: 1734633000,
    endTime: undefined,
    groups: ["Zug A", "Zug B", "Jugend"],
    title: "UVV (Test)",
    participants: [
      {
        name: "Mustermann, Max",
        group: "Zug B",
      },
      {
        name: "Brandlhuber, Muk",
        group: "Zug A",
      },
    ],
  },
];
