/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/analytics": {
    /** Analyse-Daten hochladen */
    post: operations["uploadAnalytics"];
  };
  "/benutzer": {
    /** Alle Benutzer auflisten */
    get: operations["getUsers"];
  };
  "/benutzer/{userId}/name": {
    /** Name eines Benutzers ändern */
    post: operations["updateUserDisplayName"];
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    User: {
      uid: string;
      email?: string;
      displayName?: string;
      disabled: boolean;
      roles: string[];
      vehicle?: string;
    };
    AnalyticsReport: {
      exceptions: {
        errorClass: string;
        message: string;
        stacktrace?: string;
      }[];
      context?: string;
      unhandled: boolean;
      /** @enum {string} */
      severity?: "error" | "warning" | "info";
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
    };
  };
  responses: {
    /** @description Authentifizierung ist fehlgeschlagen */
    UnauthorizedError: {
      content: never;
    };
  };
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type $defs = Record<string, never>;

export type external = Record<string, never>;

export interface operations {
  /** Analyse-Daten hochladen */
  uploadAnalytics: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["AnalyticsReport"];
      };
    };
    responses: {
      /** @description Erfolg */
      200: {
        content: never;
      };
      401: components["responses"]["UnauthorizedError"];
    };
  };
  /** Alle Benutzer auflisten */
  getUsers: {
    responses: {
      /** @description Erfolg */
      200: {
        content: {
          "application/json": components["schemas"]["User"][];
        };
      };
      401: components["responses"]["UnauthorizedError"];
      /** @description Interner Server-Fehler */
      500: {
        content: never;
      };
    };
  };
  /** Name eines Benutzers ändern */
  updateUserDisplayName: {
    parameters: {
      path: {
        /** @description UID des Benutzers */
        userId: string;
      };
    };
    requestBody?: {
      content: {
        "application/json": {
          displayName?: string;
        };
      };
    };
    responses: {
      /** @description Erfolg */
      200: {
        content: never;
      };
      /** @description Benutzer-ID fehlt oder Body ist fehlerhaft */
      400: {
        content: never;
      };
      401: components["responses"]["UnauthorizedError"];
      /** @description Interner Server-Fehler */
      500: {
        content: never;
      };
    };
  };
}
