import { Training } from "@/modules/training/models/Training";
import { formatDateWithoutYear } from "@/utils/dates";

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
      if (!(invalidGroup in participantsByGroup)) {
        participantsByGroup[invalidGroup] = [];
      }

      participantsByGroup[invalidGroup].push(responsiblePerson);
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
