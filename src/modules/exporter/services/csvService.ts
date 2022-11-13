export function saveAsCsv(data: string[][], fileName: string = "Download.csv") {
  const BOM = "\uFEFF";
  const csvContent =
    "data:text/csv;charset=utf-8," +
    BOM +
    encodeURIComponent(data.map((row) => row.join(";")).join("\n"));

  const link = document.createElement("a");
  link.setAttribute("href", csvContent);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
