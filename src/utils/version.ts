const buildTimestampUtc = document.documentElement.dataset.buildTimestampUtc;

let version = "Unbekannt";

if (buildTimestampUtc !== undefined) {
  const date = new Date(buildTimestampUtc);
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  version = year + month + day;
}

version += " (" + process.env.VUE_APP_GIT_HASH + ")";

export default version;
