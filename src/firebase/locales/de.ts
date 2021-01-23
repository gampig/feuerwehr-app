const de: { [index: string]: any } | string | null = {
  PERMISSION_DENIED: "Der Zugang zu diesem Vorgang wurde verweigert.",
  cancelled: "Der Vorgang wurde abgebrochen.",
  unknown: "Ein unbekannter Fehler ist aufgetreten.",
  "invalid-argument":
    "Ein ungültiges Argument wurde von der App verwendet. Bitte dem Admin melden.",
  "deadline-exceeded":
    "Der Vorgang konnte nicht vor seiner Deadline abgeschlossen werden.",
  "not-found": "Das Dokument wurde nicht gefunden.",
  "already-exists": "Das Dokument existiert bereits.",
  "permission-denied":
    "Deine Rechte sind für diesen Vorgang nicht ausreichend.",
  "resource-exhausted":
    "Eine Ressource (max. Datenvolumen o.ä.) wurde aufgebraucht. Bitte dem Admin melden.",
  "failed-precondition":
    "Der Vorgang konnte nicht gestartet werden, da das System nicht im richtigen Zustand ist. Bitte dem Admin melden.",
  aborted: "Der Vorgang wurde abgebrochen.",
  "out-of-range": "Die eingegebenen Daten sind ungültig.",
  unimplemented:
    "Dieser Vorgang ist nicht unterstützt oder aktiviert. Bitte dem Admin melden.",
  internal:
    "Ein interner Fehler in der Datenbank ist aufgetreten. Bitte dem Admin melden.",
  unavailable:
    "Die Datenbank ist derzeit nicht verfügbar. Bitte dem Admin melden.",
  "data-loss":
    "Wegen eines Fehlers sind Daten verloren gegangen. Bitte dem Admin melden.",
  unauthenticated: "Bitte anmelden.",
  auth: {
    "admin-restricted-operation":
      "Dieser Vorgang kann nur von Administratoren durchgeführt werden.",
    "argument-error": "",
    "app-not-authorized":
      "Die Datenbank erlaubt diese App nicht. Bitte dem Admin melden.",
    "captcha-check-failed":
      "Der reCAPTCHA-Token provided ist entweder ungültig, abgelaufen oder bereits verwendet.",
    "cors-unsupported": "Dieser Browser wird nicht unterstützt.",
    "credential-already-in-use":
      "Diese Anmeldeinformation ist bereits mit einem Konto verknüpft.",
    "requires-recent-login": "Bitte erneut anmelden.",
    "email-change-needs-verification":
      "Multi-Faktor-Benutzer müssen immer eine verifizierte E-Mail haben.",
    "email-already-in-use": "Diese E-Mail-Adresse wird bereits verwendet.",
    "expired-action-code": "Der Aktionscode ist abgelaufen.",
    "internal-error": "Ein interner Fehler ist aufgetreten.",
    "invalid-user-token":
      "Die Anmeldeinformation ist ungültig für diesen Benutzer. Bitte dem Admin melden.",
    "invalid-auth-event": "Ein interner Fehler ist aufgetreten.",
    "invalid-continue-uri": "Die URL ist ungültig. Bitte dem Admin melden.",
    "invalid-email": "Diese E-Mail-Adresse ist ungültig.",
    "invalid-api-key":
      "Der API-Schlüssel ist ungültig. Bitte dem Admin melden.",
    "invalid-credential":
      "Die Anmeldeinformation ist ungültig oder abgelaufen.",
    "unauthorized-domain":
      "Diese Domain ist nicht erlaubt. Bitte dem Admin melden.",
    "invalid-action-code":
      "Der Aktionscode ist ungültig. Dies kann passieren, wenn der Code verformt, abgelaufen oder bereits verwendet wurde.",
    "wrong-password":
      "Das Passwort ist ungültig oder dieser Benutzer hat kein Passwort.",
    "invalid-recipient-email":
      "Die E-Mail für diesen Vorgang konnte nicht gesendet werden, da die Empfängeradresse ungültig ist.",
    "invalid-tenant-id": "Die Tenant-ID ist ungültig. Bitte dem Admin melden.",
    "multi-factor-auth-required":
      "Dieser Account benutzt das Multi-Faktor-Verfahren zur Anmeldung.",
    "missing-iframe-start": "Ein interner Fehler ist aufgetreten.",
    "app-deleted":
      "Die Datenbank existiert nicht mehr. Bitte dem Admin melden.",
    "account-exists-with-different-credential":
      "Es existiert bereits ein Account mit dieser E-Mail-Adresse, der jedoch nicht diese Anmeldung unterstützt. Bitte verwende eine andere Anmeldemethode.",
    "network-request-failed":
      "Ein Problem mit dem Netzwerk ist aufgetreten. Bitte erneut versuchen.",
    "no-auth-event": "Ein interner Fehler ist aufgetreten.",
    "no-such-provider":
      "Benutzer ist nicht mit der ausgewählten Methode verknüpft.",
    "operation-not-allowed":
      "Dieser Anmelde-Provider ist nicht erlaubt. Bitte dem Admin melden.",
    "provider-already-linked":
      "Ein Benutzer kann nur mit einem Account von dieser Anmeldemethode verknüpft sein.",
    "quota-exceeded":
      "Das Datenbank-Kontingent dieser App ist aufgebraucht. Bitte dem Admin melden.",
    "rejected-credential":
      "Die Anforderung enthält ungültige Anmeldeinformationen.",
    timeout: "Der Vorgang wurde abgebrochen, da er zu lange dauerte.",
    "user-token-expired": "Die Sitzung ist abgelaufen. Bitte erneut anmelden.",
    "too-many-requests":
      "Es wurden zu viele Anforderungen in kurzer Zeit begonnen. Bitte warte einen Moment und versuche es dann erneut.",
    "unverified-email": "Dieser Vorgang benötigt eine verifizierte E-Mail.",
    "user-not-found":
      "Es wurde kein Benutzer zur gegebenen ID gefunden. Der Benutzer wurde möglicherweise gelöscht.",
    "user-disabled": "Dieser Benutzer wurde gesperrt.",
    "user-mismatch":
      "Die eingegebenen Anmeldeinformationen stimmen nicht mit dem zuvor angemeldeten Benutzer überein.",
    "user-signed-out": "",
    "weak-password":
      "Das Passwort muss mindestens 6 Zeichen oder mehr enthalten.",
    "web-storage-unsupported":
      'Dein Browser unterstützt "Web Storage" nicht. Bitte einen anderen Browser verwenden oder updaten.',
  },
};

export default de;
