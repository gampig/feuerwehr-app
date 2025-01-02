import ErrorReportBuilder from "@/services/errorReport";
import { ComponentPublicInstance } from "vue";

export default function (
  err: unknown,
  instance: ComponentPublicInstance | null,
  info: string
): void {
  const errorReportBuilder = new ErrorReportBuilder(true);

  if (err instanceof Error) {
    errorReportBuilder.addException(err);
  }

  errorReportBuilder.addVueInfo(info);

  if (instance) {
    errorReportBuilder.setVue(instance);
  }

  errorReportBuilder.getReport().send();

  const errorMessage =
    err instanceof Error ? `\n\nFehlertext:\n${err.message}` : "";

  alert(
    `Ein Fehler ist aufgetreten :-(\n\nDie Fehlermeldung wurde automatisch weitergeleitet.${errorMessage}`
  );
}
