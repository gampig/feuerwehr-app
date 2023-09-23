import Vue from "vue";
import firebase from "firebase/app";
import deviceCredentials, { deviceId } from "@/services/device";
import version from "@/utils/version";

enum Severity {
  error,
  warning,
  info,
}

function makeBody(err: Error, vm: Vue, info: string): BodyInit {
  const apiKey = process.env?.VUE_APP_ANALYTICS_API_KEY;

  try {
    const firebaseAuth = firebase.auth();

    return JSON.stringify({
      apiKey: apiKey,

      exceptions: [
        {
          errorClass: "VueErrorInfo",
          message: info,
        },
        {
          errorClass: err.name,
          message: err.message,
          stacktrace: err.stack,
        },
      ],

      context: vm.$route.fullPath,

      severity: Severity[Severity.error],

      user: {
        id: firebaseAuth.currentUser?.uid,
        name: firebaseAuth.currentUser?.displayName,
        email: firebaseAuth.currentUser?.email,
      },
      app: {
        version: version,
      },
      device: {
        id: deviceId,
        email: deviceCredentials.get()?.email,
        time: new Date().toISOString(),
      },
    });
  } catch (e) {
    return JSON.stringify({
      apiKey: apiKey,
      context: "Fehler während Fehlerbehandlung",
    });
  }
}

export function reportError(err: Error, vm: Vue, info: string): void {
  const apiEndpoint = process.env?.VUE_APP_API_ENDPOINT;

  if (apiEndpoint) {
    fetch(`${apiEndpoint}/v1/analytics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: makeBody(err, vm, info),
    })
      .then((response) => {
        if (response.status != 200) {
          console.error(
            "Response from analytics server:",
            response.status,
            response.statusText
          );
        }
      })
      .catch((reason) => {
        console.error("Error while contacting analytics server:", reason);
      });
  } else {
    console.error("Error:", err.message);
  }

  alert(
    `Ein Fehler ist aufgetreten :-(\n\nDie Fehlermeldung wurde automatisch weitergeleitet.\n\nFehlertext:\n${err.message}`
  );
}
