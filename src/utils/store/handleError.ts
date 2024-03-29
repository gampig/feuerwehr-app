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

export default function (error: any) {
  if (error instanceof Error) {
    let translatedErrorMessage = null;

    const firebaseError = error as Error | firebase.default.FirebaseError;
    if ("code" in firebaseError) {
      translatedErrorMessage = translateFirebaseError(firebaseError.code);
    }

    showError(translatedErrorMessage || error.message);

    new ErrorReportBuilder(false).addException(error).getReport().send();
  }
}
