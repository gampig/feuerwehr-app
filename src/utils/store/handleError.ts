import { showError } from "@/utils/notifications";
import de from "@/firebase/locales/de";
import ErrorReportBuilder from "@/services/errorReport";
import { FirebaseError } from "firebase/app";
import { Ref, watch } from "vue";

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

function handleError(error: any) {
  const builder = new ErrorReportBuilder(false);

  if (error instanceof Error) {
    let translatedErrorMessage = null;

    const firebaseError = error as Error | FirebaseError;
    if ("code" in firebaseError) {
      translatedErrorMessage = translateFirebaseError(firebaseError.code);
    }

    showError(translatedErrorMessage || error.message);

    builder.addException(error);
  } else if (typeof error === "string") {
    showError(error);
    builder.addErrorMessage(error);
  }

  builder.getReport().send();
}

addEventListener("unhandledrejection", (event) => handleError(event.reason));

export default handleError;

export function useErrorHandler(error: Ref<Error | undefined>) {
  const errorWatchHandle = watch(error, handleError);
  return { errorWatchHandle };
}
