import { Training } from "@/modules/training/models/Training";
import { formatDate, formatDateWithoutYear } from "@/utils/dates";

interface TrainingView {
  date: string;
  durationInMinutes: number;
  title: string;
  groups: string[];
  participantsByGroup: { [group: string]: string[] | undefined };
}

export const groupOfEveryone = "Alle";
export const invalidGroup = "Fehlende Gruppe";

export function formatTraining(training: Training): TrainingView {
  const startTime = training.startTime ?? training.creationTime;
  const twoHoursInSeconds = 2 * 60 * 60;
  const endTime = training.endTime ?? startTime + twoHoursInSeconds;
  const date = formatDateWithoutYear(startTime);

  const participantsByGroup: { [group: string]: string[] } = {};
  const participants = Object.values(training.participants ?? {}).map(
    (participant) => participant.name
  );

  for (const participantId in training.participants ?? {}) {
    const participant = training.participants![participantId];
    const group = participant.group ?? invalidGroup;

    if (!(group in participantsByGroup)) {
      participantsByGroup[group] = [];
    }

    participantsByGroup[group].push(participant.name);
  }

  for (const responsiblePerson of training.responsiblePeople ?? []) {
    if (!participants.includes(responsiblePerson)) {
      const targetGroup =
        training.groups && training.groups.length === 1
          ? training.groups[0]
          : invalidGroup;

      if (!(targetGroup in participantsByGroup)) {
        participantsByGroup[targetGroup] = [];
      }

      participantsByGroup[targetGroup].push(responsiblePerson);
      participants.push(responsiblePerson);
    }
  }

  participantsByGroup[groupOfEveryone] = participants;

  return {
    date: date,
    durationInMinutes: (endTime - startTime) / 60,
    title: training.title,
    groups: Object.keys(participantsByGroup),
    participantsByGroup: participantsByGroup,
  };
}

export function createTableForTrainingsOfGroup(
  trainings: TrainingView[],
  group: string
) {
  const interestingTrainings = trainings.filter((training) =>
    training.groups.includes(group)
  );
  const peopleInGroup = [
    ...new Set(
      interestingTrainings.flatMap(
        (training) => training.participantsByGroup[group] ?? []
      )
    ),
  ].sort();

  const rows: any[][] = [
    ["", ...interestingTrainings.map((training) => training.date)],
  ];

  for (const person of peopleInGroup) {
    rows.push([
      person,
      ...interestingTrainings.map((training) =>
        (training.participantsByGroup[group] ?? []).includes(person)
          ? 1
          : undefined
      ),
    ]);
  }

  return rows;
}

export function createTableForTrainingOverview(
  trainings: TrainingView[],
  groups: string[]
) {
  const filteredGroups = groups.filter((group) => group !== "Alle");
  const rows: any[][] = [
    ["Datum", "Thema", "Dauer (Minuten)", ...filteredGroups],
  ];

  for (const training of trainings) {
    rows.push([
      training.date,
      training.title,
      training.durationInMinutes,
      ...filteredGroups.map(
        (group) => (training.participantsByGroup[group] ?? []).length
      ),
    ]);
  }

  return rows;
}
