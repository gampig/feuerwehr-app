import { Training } from "@/modules/training/models/Training";
import { formatDateTime } from "@/utils/dates";

interface ParticipantDetails {
  group: string;
  isResponsible: boolean;
}

export class TrainingFormatter {
  private uebung: Training;
  private index: number;

  constructor(uebung: Training, index: number) {
    this.uebung = uebung;
    this.index = index;
  }

  static getHeaderRow() {
    return [
      "Übungsnummer",
      "Beginn",
      "Ende",
      "Titel",
      "Teilnehmer",
      "Verantwortlich",
      "Gruppe",
    ];
  }

  toDataRows(): string[][] {
    const trainingRow = [
      (this.index + 1).toString(),
      formatDateTime(this.uebung.startTime),
      formatDateTime(this.uebung.endTime),
      this.uebung.title,
    ];

    if (!this.uebung.participants) {
      return [trainingRow.concat(["", "", ""])];
    }

    const participants = this.getParticipantsByName();

    // Add responsible people that are not in the list of participants yet
    this.uebung.responsiblePeople?.forEach((responsiblePerson) => {
      if (responsiblePerson in participants === false) {
        participants[responsiblePerson] = {
          group: "",
          isResponsible: true,
        };
      }
    });

    return Object.entries(participants)
      .sort((entryA, entryB) => this.compareParticipantEntries(entryA, entryB))
      .map(([name, details]) => [
        ...trainingRow,
        name,
        details.isResponsible ? "Ja" : "",
        details.group,
      ]);
  }

  private compareParticipantEntries(
    [nameA, detailsA]: [string, ParticipantDetails],
    [nameB, detailsB]: [string, ParticipantDetails]
  ): number {
    if (detailsA.isResponsible !== detailsB.isResponsible) {
      return Number(detailsB.isResponsible) - Number(detailsA.isResponsible);
    }

    const groupComparison = detailsA.group.localeCompare(
      detailsB.group,
      undefined,
      {
        sensitivity: "base",
      }
    );

    if (groupComparison !== 0) {
      return groupComparison;
    }

    return nameA.localeCompare(nameB, undefined, {
      sensitivity: "base",
    });
  }

  private getParticipantsByName(): { [name: string]: ParticipantDetails } {
    if (!this.uebung.participants) {
      return {};
    }

    return Object.fromEntries(
      Object.values(this.uebung.participants).map((participant) => [
        participant.name,
        {
          group: participant.group ?? "",
          isResponsible:
            this.uebung.responsiblePeople?.includes(participant.name) ?? false,
        },
      ])
    );
  }
}
