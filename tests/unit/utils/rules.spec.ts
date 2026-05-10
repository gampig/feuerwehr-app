import { beforeAll, describe, expect, it } from "vitest";
import moment from "moment";
import {
  required,
  onlyPastAllowed,
  restrictFuture,
  recently,
  isValidName,
} from "@/utils/rules";

describe("src/utils/rules", () => {
  beforeAll(() => {
    moment.locale("de");
  });
  describe("required", () => {
    it("returns true for truthy values", () => {
      expect(required("test")).toBe(true);
      expect(required(1)).toBe(true);
      expect(required(true)).toBe(true);
      expect(required([])).toBe(true);
      expect(required({})).toBe(true);
    });

    it("returns error message for falsy values", () => {
      expect(required("")).toBe("Bitte fülle dieses Feld aus");
      expect(required(null)).toBe("Bitte fülle dieses Feld aus");
      expect(required(undefined)).toBe("Bitte fülle dieses Feld aus");
      expect(required(false)).toBe("Bitte fülle dieses Feld aus");
      expect(required(0)).toBe("Bitte fülle dieses Feld aus");
    });
  });

  describe("onlyPastAllowed", () => {
    it("returns true for undefined or empty values", () => {
      expect(onlyPastAllowed(undefined)).toBe(true);
      expect(onlyPastAllowed("")).toBe(true);
    });

    it("returns true for past dates", () => {
      // Use a fixed past date
      expect(onlyPastAllowed("01/01/2020 10:00")).toBe(true);
    });

    it("returns error message for future dates", () => {
      const futureDate = moment().add(1, "day").format("DD/MM/YYYY HH:mm");
      expect(onlyPastAllowed(futureDate)).toBe(
        "Zeitpunkt muss in Vergangenheit liegen"
      );
    });

    it("returns true for current time", () => {
      // Use a fixed recent date in German format
      expect(onlyPastAllowed("01.01.2020 10:00")).toBe(true);
    });
  });

  describe("restrictFuture", () => {
    it("returns true for undefined or empty values", () => {
      expect(restrictFuture(undefined)).toBe(true);
      expect(restrictFuture("")).toBe(true);
    });

    it("returns true for dates within 24 hours", () => {
      const nearFuture = moment().add(1, "days").format("DD/MM/YYYY HH:mm");
      expect(restrictFuture(nearFuture)).toBe(true);
    });

    it("returns error message for dates more than 24 hours in the future", () => {
      const farFuture = moment().add(2, "days").format("DD/MM/YYYY HH:mm");
      expect(restrictFuture(farFuture)).toBe(
        "Zeitpunkt darf nicht später als 24 Stunden ab jetzt sein"
      );
    });
  });

  describe("recently", () => {
    it("returns true for undefined or empty values", () => {
      expect(recently(undefined)).toBe(true);
      expect(recently("")).toBe(true);
    });

    it("returns true for dates within 7 days", () => {
      const recentDate = moment()
        .subtract(3, "days")
        .format("DD/MM/YYYY HH:mm");
      expect(recently(recentDate)).toBe(true);
    });

    it("returns error message for dates older than 7 days", () => {
      const oldDate = moment().subtract(10, "days").format("DD/MM/YYYY HH:mm");
      expect(recently(oldDate)).toBe(
        "Zeitpunkt darf nicht länger als 7 Tage her sein"
      );
    });
  });

  describe("isValidName", () => {
    it("returns true for valid names in format 'Lastname, Firstname'", () => {
      expect(isValidName("Mustermann, Max")).toBe(true);
      expect(isValidName("von Müller, Anna")).toBe(true);
    });

    it("returns error message for invalid formats", () => {
      expect(isValidName("Max Mustermann")).toBe("Format: Nachname, Vorname");
      expect(isValidName("Mustermann")).toBe("Format: Nachname, Vorname");
      expect(isValidName("")).toBe("Format: Nachname, Vorname");
      expect(isValidName(undefined)).toBe("Format: Nachname, Vorname");
      expect(isValidName("Mustermann, Max, Extra")).toBe(
        "Format: Nachname, Vorname"
      );
    });
  });
});
