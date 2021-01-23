import moment from "moment";

const formatDateTime = function (date: number) {
  return moment.unix(date).format("L LT");
};

const formatDate = function (date: number) {
  return moment.unix(date).format("L");
};

const formatDateTimeFromNow = function (date: number) {
  return moment.unix(date).fromNow();
};

export { formatDate, formatDateTime, formatDateTimeFromNow };
