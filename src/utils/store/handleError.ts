import { showError } from "@/utils/notifications";
import de from "@/firebase/locales/de";
import { Commit } from "vuex";

function translateError(code?: string): string | null {
  if (code === undefined) {
    return null;
  }
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

export default function (commit: Commit, error: Error & { code?: string }) {
  const message = translateError(error.code) || error.message;
  showError(message);

  if (error.code === "auth/requires-recent-login") {
    commit("reauthenticationRequired");
  }
}
