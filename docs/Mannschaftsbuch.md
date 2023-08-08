# Mannschaft eintragen

## Workflow

```mermaid
flowchart TD
    Einsatzliste[Einsatz aus Liste auswählen] --> DarfBearbeiten{Darf bearbeiten?}
    DarfBearbeiten -->|Ja| EinsatzBearbeiten[Einsatzdaten bearbeiten]
    DarfBearbeiten -->|Nein| ListeFestgelegt{Liste fest zugewiesen?}
    EinsatzBearbeiten --> ListeFestgelegt
    ListeFestgelegt -->|Ja| Mannschaft
    ListeFestgelegt -->|Nein| Moduswahl[Liste auswählen]
    Moduswahl --> Mannschaft[Liste bearbeiten]
```

- *Liste* kann sein:
  - Bereitschaftsliste
  - Mannschaftsliste pro Fahrzeug
- Liste ist folgenden Benutzern fest zugewiesen:
  - Alarm-PC: Bereitschaftsliste
  - Fahrzeuge: Mannschaftsliste für jeweiliges Fahrzeug
- Liste bearbeiten:
  - Wenn Mannschaftsliste ausgewählt ist: Einsatzende eingeben
  - Personen auswählen
  - Funktionen zuweisen (Maschinist, Gruppenführer usw.)
