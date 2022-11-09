export function saveAsCsv(data: string[][]) {
  const csvContent =
    "data:text/csv;charset=utf-8," +
    data.map((row) => row.join(";")).join("\n");
  const encodedContent = encodeURI(csvContent);
  window.open(encodedContent);
}
