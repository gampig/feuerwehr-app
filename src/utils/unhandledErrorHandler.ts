import ErrorReportBuilder from "@/services/errorReport";

export default function (err: Error, vm: Vue, info: string): void {
  new ErrorReportBuilder(true)
    .addException(err)
    .addVueInfo(info)
    .setVue(vm)
    .getReport()
    .send();

  alert(
    `Ein Fehler ist aufgetreten :-(\n\nDie Fehlermeldung wurde automatisch weitergeleitet.\n\nFehlertext:\n${err.message}`
  );
}
