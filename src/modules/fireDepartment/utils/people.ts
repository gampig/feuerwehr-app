import { Person } from "../models/Person";

export function getNameWithStatus(person: any) {
  if (typeof person === "object") {
    const personObject = person as Person;
    const name = `${personObject.lastName}, ${personObject.firstName}`;
    return personObject.status === "Aktiv"
      ? name
      : `${name} (${personObject.status})`;
  } else {
    return person;
  }
}

export function getName(person: any) {
  if (typeof person === "object") {
    const personObject = person as Person;
    const name = `${personObject.lastName}, ${personObject.firstName}`;
    return name;
  } else {
    return person;
  }
}
