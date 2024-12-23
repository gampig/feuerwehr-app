import moment from "moment";
import { dateTimeToUnix } from "./dates";

export function required(value: any) {
  return !!value || "Bitte fülle dieses Feld aus";
}

export function onlyPastAllowed(value?: string) {
  return (
    !value ||
    dateTimeToUnix(value) <= moment().unix() ||
    "Zeitpunkt muss in Vergangenheit liegen"
  );
}

export function restrictFuture(value?: string) {
  return (
    !value ||
    dateTimeToUnix(value) <= moment().add(1, "day").unix() ||
    "Zeitpunkt darf nicht später als 24 Stunden ab jetzt sein"
  );
}

export function recently(value?: string) {
  const aDayAgo = moment().subtract(7, "day").unix();
  return (
    !value ||
    dateTimeToUnix(value) > aDayAgo ||
    "Zeitpunkt darf nicht länger als 7 Tage her sein"
  );
}
