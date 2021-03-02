import moment from "moment";

const formatDateTime = function (date: Date) {
  return moment(date).format("L LT");
};

const formatDate = function (date: Date) {
  return moment(date).format("L");
};

const formatDateTimeFromNow = function (date: Date) {
  return moment(date).fromNow();
};

const dateTimeToUnix = function (dateTime: string) {
  return moment(dateTime, "L LT").unix();
};

export { formatDate, formatDateTime, formatDateTimeFromNow, dateTimeToUnix };
