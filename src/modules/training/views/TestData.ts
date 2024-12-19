import { Training } from "../models/Training";

export const trainings: Training[] = [
  {
    id: "randomId",
    startTime: 1734633000,
    endTime: undefined,
    groups: ["Zug A", "Zug B", "Jugend"],
    title: "UVV (Test)",
    location: "Gerätehaus",
    participants: [
      {
        name: "Mustermann, Max",
        group: "Zug B",
      },
      {
        name: "Brandlhuber, Muk",
        group: "Zug A",
      },
      { name: "Gschaftlhuber, Sepp" },
    ],
  },
];
