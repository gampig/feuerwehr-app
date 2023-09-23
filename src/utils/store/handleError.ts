import { showError } from "@/utils/notifications";
import de from "@/firebase/locales/de";
import ErrorReportBuilder from "@/services/errorReport";

function translateFirebaseError(code: string): string | null {
  const translation = code
    .split("/")
    .reduce(
      (segment, codeSegment) =>
        typeof segment === "string" ? segment : segment && segment[codeSegment],
      de
    );
  if (translation === null || typeof translation !== "string") {
    return null;
  }
  return translation;
}

export default function (error: Error | firebase.default.FirebaseError) {
  let translatedErrorMessage = null;

  if ("code" in error) {
    translatedErrorMessage = translateFirebaseError(error.code);
  }

  showError(translatedErrorMessage || error.message);

  new ErrorReportBuilder(false).addException(error).getReport().send();
}
