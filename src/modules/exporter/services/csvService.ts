export function saveAsCsv(data: string[][]) {
  const BOM = "\uFEFF";
  const csvContent =
    "data:text/csv;charset=utf-8," +
    BOM +
    data.map((row) => row.join(";")).join("\n");
  const encodedContent = encodeURI(csvContent);
  window.open(encodedContent);
}
