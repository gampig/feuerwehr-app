import Vue from "vue";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "@/firebase";
import deviceCredentials, { deviceId } from "@/services/device";
import version from "@/utils/version";

type Severity = "error" | "warning" | "info";

interface Exception {
  errorClass: string;
  message: string;
  stacktrace?: string;
}

interface Report {
  apiKey?: string;

  exceptions: Exception[];
  context?: string;
  unhandled: boolean;
  severity?: Severity;

  user?: {
    id: string;
    name?: string;
    email?: string;
  };
  app?: {
    version?: string;
  };
  device?: {
    id?: string;
    email?: string;
    time?: string;
  };
}

class ErrorReport {
  private report: Report;

  constructor(report: Report) {
    this.report = report;
  }

  send(): void {
    const body = JSON.stringify(this.report);
    const apiEndpoint = process.env?.VUE_APP_API_ENDPOINT;

    if (apiEndpoint) {
      fetch(`${apiEndpoint}/v1/analytics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      })
        .then((response) => {
          if (response.status != 200) {
            console.error("Error:", this.report);
            console.error(
              "Response from analytics server:",
              response.status,
              response.statusText
            );
          }
        })
        .catch((reason) => {
          console.error("Error:", this.report);
          console.error("Error while contacting analytics server:", reason);
        });
    } else {
      console.error(
        "Couldn't send error report (no API endpoint configured):",
        this.report
      );
    }
  }
}

export default class ErrorReportBuilder {
  private report: Report;

  constructor(unhandled: boolean, severity: Severity = "error") {
    this.report = {
      apiKey: process.env?.VUE_APP_ANALYTICS_API_KEY,
      exceptions: [],
      unhandled: unhandled,
      severity: severity,
    };
  }

  addException(err: Error): ErrorReportBuilder {
    this.report.exceptions.push({
      errorClass: err.name,
      message: err.message,
      stacktrace: err.stack,
    });
    return this;
  }

  addVueInfo(info: string): ErrorReportBuilder {
    this.report.exceptions.push({
      errorClass: "VueErrorInfo",
      message: info,
    });
    return this;
  }

  setVue(vm: Vue): ErrorReportBuilder {
    this.report.context = vm.$route.fullPath;
    return this;
  }

  getReport(): ErrorReport {
    try {
      this.prepareReport();
    } catch (e) {
      console.error("Could not prepare report:", e);
    }

    return new ErrorReport(this.report);
  }

  private prepareReport() {
    const firebaseAuth = getAuth(firebaseApp);
    if (firebaseAuth.currentUser) {
      this.report.user = {
        id: firebaseAuth.currentUser.uid,
        name: firebaseAuth.currentUser.displayName ?? undefined,
        email: firebaseAuth.currentUser.email ?? undefined,
      };
    }

    this.report.app = {
      version: version,
    };

    this.report.device = {
      id: deviceId,
      email: deviceCredentials.get()?.email,
      time: new Date().toISOString(),
    };
  }
}
