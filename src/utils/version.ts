const buildTimestamp = BUILD_TIME;

let version = "Unbekannt";

if (buildTimestamp !== undefined) {
  const date = new Date(buildTimestamp);
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  version = year + month + day;
}

version += " (" + GIT_HASH + ")";

export default version;
