import moment from "moment";

const formatDateTime = function (date?: number) {
  if (date === undefined) {
    return "";
  }
  return moment.unix(date).format("L LT");
};

const formatDate = function (date?: number) {
  if (date === undefined) {
    return "";
  }
  return moment.unix(date).format("L");
};

const formatDateWithoutYear = function (date?: number) {
  if (date === undefined) {
    return "";
  }
  return moment.unix(date).format("DD.MM.");
};

const formatDateTimeFromNow = function (date?: number) {
  if (date === undefined) {
    return "";
  }
  return moment.unix(date).fromNow();
};

const dateTimeToUnix = function (dateTime: string) {
  return moment(dateTime, "L LT").unix();
};

export {
  formatDate,
  formatDateWithoutYear,
  formatDateTime,
  formatDateTimeFromNow,
  dateTimeToUnix,
};
