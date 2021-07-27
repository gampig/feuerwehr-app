# Übung hinzufügen
## Teilnehmer
- Gruppenführer
- KalenderServer
## Ereignisse
- Der Gruppenführer drückt einen Knopf, um eine Übung hinzuzufügen
  - FeuerwehrApp zeigt ein Formular
- Der Gruppenführer trägt den Zeitpunkt des Termins, den Titel, die beteiligten Gruppen und eine optionale Beschreibung ein
- Er drückt speichern
  - FeuerwehrApp speichert den Termin 
  - Es zeigt eine kleine Notiz, dass erfolgreich gespeichert wurde
  - FeuerwehrApp sendet den Termin an KalenderServer
  - Wenn die Übung in der Vergangenheit war: Anwendungsfall **Übungsteilnehmer eintragen**
- (Optional) Der Gruppenführer drückt den Knopf "Einladung kopieren", damit diese z.B. über WhatsApp verteilt werden kann
  - FeuerwehrApp fügt die Einladung zur Zwischenablage hinzu
## Anfangsbedingungen
- Der Gruppenführer hat sich mit seiner Pin oder seinem Passwort angemeldet
## Endbedingungen
## Qualitätsanforderungen

# Übungsteilnehmer eintragen
## Teilnehmer
- Gruppenführer
## Ereignisse
  - FeuerwehrApp zeigt eine Liste von Personen für die erste beteiligte Gruppe an
- Der Gruppenführer wählt die Übungsteilnehmer für die erste Gruppe aus
- Er drückt einen Knopf, um die nächste Gruppe auszuwählen
  - FeuerwehrApp speichert die Personen
  - Es zeigt die Personen für die zweite Gruppe an
- Der Gruppenführer wählt die Personen aus
(Wenn noch mehr Gruppen zugeteilt: Wiederhole Schritte)
- Der Gruppenführer klickt auf "Fertig"
  - FeuerwehrApp speichert die Personen
  - Es schließt das Fenster und kehrt zur Übungsübersicht zurück
## Anfangsbedingungen
- Eine vergangene Übung wurde über **Übung hinzufügen** hinzugefügt
## Endbedingungen
- Teilnehmer wurden zur Übung hinzugefügt

# Alle Übungen anzeigen
## Teilnehmer
- Gruppenführer
## Ereignisse
## Anfangsbedingungen
## Endbedingungen
## Qualitätsanforderungen

# Übung anzeigen
## Teilnehmer
- Gruppenführer
## Ereignisse
## Anfangsbedingungen
## Endbedingungen
## Qualitätsanforderungen
