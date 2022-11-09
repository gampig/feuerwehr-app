import { Person } from "@/modules/people/models/Person";

export function exportPeopleWithStatus(people: Person[]): string[][] {
  return [
    ["Name", "Status"],
    ...people.map((person) => [person.id, person.status]),
  ];
}
