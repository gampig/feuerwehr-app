# Mannschaft zu Einsatz eintragen
## Teilnehmer
- Gruppenführer
## Ereignisse
- Der Gruppenführer möchte seine Mannschaft eintragen
  - FeuerwehrApp zeigt eine Liste von vorhandenen Einsätzen an, deren Ende weniger als 24 Stunden her ist oder noch nicht eingetragen wurde
- Der Gruppenführer möchte einen neuen Einsatz hinzufügen und drückt den entsprechenden Knopf
  - FeuerwehrApp zeigt das Formular zur Einsatzerstellung an
- Der Gruppenführer bearbeitet die Details des Einsatzes
- Er speichert sie
  - FeuerwehrApp speichert die Details
  - Änderungen werden auch an andere FeuerwehrApp Instanzen gesendet
  - Das Programm zeigt alle möglichen Fahrzeuge an
  - Es zeigt eine kleine Notiz an, dass erfolgreich gespeichert wurde
- Der Gruppenführer wählt ein Fahrzeug aus
  - FeuerwehrApp zeigt eine Liste von Personen an
- Der Gruppenführer wählt die Personen aus, die in seiner Mannschaft sind
  - FeuerwehrApp speichert jede hinzugefügte Person
  - Es sendet die Änderungen auch an andere Instanzen
- Der Gruppenführer ordnet den Personen Aufgaben aus einer Liste zu (Einsatzleiter, Zugführer, Gruppenführer, Maschinist, Atemschutz, Melder, Atemschutzüberwachung)
  - FeuerwehrApp speichert die Aufgaben
  - Es sendet die Änderungen an andere Instanzen
## Anfangsbedingungen
- Das Gerät ist authorisiert oder der Gruppenführer ist angemeldet
## Endbedingungen
- Evtl. wurde ein neuer Einsatz hinzugefügt
- Es wurde eine Mannschaft inkl. Aufgaben zu einem Fahrzeug hinzugefügt
## Qualitätsanforderungen
- Der Gruppenführer soll jederzeit zu einer vorherigen Einstellung zurückkehren können, ohne seine Eingaben zu verlieren
