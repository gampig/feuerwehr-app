import { beforeAll, describe, expect, it } from "vitest";
import moment from "moment";
import {
  formatDate,
  formatDateTime,
  dateTimeToUnix,
  sortDateTime,
  roundToNearestHalfHour,
} from "@/utils/dates";

describe("src/utils/dates", () => {
  beforeAll(() => {
    moment.locale("de");
  });

  it("returns an empty string for undefined date inputs", () => {
    expect(formatDate(undefined)).toBe("");
    expect(formatDateTime(undefined)).toBe("");
  });

  it("parses and sorts localized date/time strings", () => {
    expect(sortDateTime("01/01/2025 10:00", "01/01/2025 11:00")).toBe(-1);
    expect(sortDateTime("01/01/2025 11:00", "01/01/2025 10:00")).toBe(1);
    expect(sortDateTime("01/01/2025 10:00", "01/01/2025 10:00")).toBe(0);
  });

  it("converts a localized date-time string to a unix timestamp", () => {
    const expected = moment("2025-01-01 10:00", "YYYY-MM-DD HH:mm").unix();
    expect(dateTimeToUnix("01/01/2025 10:00")).toBe(expected);
  });

  it("rounds moments to the nearest half hour", () => {
    const date1 = moment("2025-01-01 10:07", "YYYY-MM-DD HH:mm");
    expect(roundToNearestHalfHour(date1).format("HH:mm")).toBe("10:00");

    const date2 = moment("2025-01-01 10:35", "YYYY-MM-DD HH:mm");
    expect(roundToNearestHalfHour(date2).format("HH:mm")).toBe("10:30");

    const date3 = moment("2025-01-01 10:50", "YYYY-MM-DD HH:mm");
    expect(roundToNearestHalfHour(date3).format("HH:mm")).toBe("11:00");
  });
});
