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

const sortDateTime = function (a: any, b: any) {
  const diff = moment(a, "L LT").diff(moment(b, "L LT"));
  if (diff > 0) return 1;
  else if (diff < 0) return -1;
  else return 0;
};

const sortDate = function (a: any, b: any) {
  const diff = moment(a, "L").diff(moment(b, "L"));
  if (diff > 0) return 1;
  else if (diff < 0) return -1;
  else return 0;
};

export {
  formatDate,
  formatDateWithoutYear,
  formatDateTime,
  formatDateTimeFromNow,
  dateTimeToUnix,
  sortDateTime,
  sortDate,
};
