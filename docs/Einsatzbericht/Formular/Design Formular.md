# Design
- Formular als Stepper
- Infos werden sofort zwischengespeichert (sollte so auch für Benutzer klar werden, z.B. mittels Hinweis)
- Validierung findet zum Abschluss statt
- Auswahlliste für eingesetzte Gerätschaften:
  - Fest definierte Vorschläge
  - Vorschläge aus vorherigen Berichten
  - Sollten per Cron-Job gesammelt werden, um Clients zu entlasten

# Wie kann verhindert werden, dass der Bericht von mehreren Personen gleichzeitig ausgefüllt wird?
- Konvention: Nur von EL/ZF
- Oder: "Lock" wird gesetzt
  - Muss von Client regelmäßig erneuert werden
