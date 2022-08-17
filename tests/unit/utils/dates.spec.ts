import { formatDateTime, formatDate, dateTimeToUnix } from "@/utils/dates";
import moment from "moment";

moment.locale("de");

const timestamp = 1640950200;
const dateStr = "31.12.2021";
const timeStr = "11:30";

describe("formatDateTime", () => {
  it("formats a Unix timestamp to a date and time string", () => {
    expect(formatDateTime(timestamp)).toBe(dateStr + " " + timeStr);
  });
});

describe("formatDate", () => {
  it("formats a Unix timestamp to a date string", () => {
    expect(formatDate(timestamp)).toBe(dateStr);
  });
});

describe("dateTimeToUnix", () => {
  it("returns the Unix timestamp of a date and time string", () => {
    expect(dateTimeToUnix(dateStr + " " + timeStr)).toBe(timestamp);
  });
});
