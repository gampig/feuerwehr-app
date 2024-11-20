import { Training } from "../models/Training";

export const trainings: Training[] = [
  {
    id: "randomId",
    startTime: "20.11.2024 19:30",
    endTime: "",
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
