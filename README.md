# FeuerwehrApp

FeuerwehrApp ist ein webbasiertes Tool für Feuerwehren, um verschiedene administrative Aufgaben zu erledigen.

# Features

Mannschaftsbuch
---------------

Mit FeuerwehrApp kann die Mannschaft eines Fahrzeuges nach einem Einsatz protokolliert werden.

![Screenshot des Mannschaftsbuchs](docs/img/screenshot_crew.png)

Kleidung verwalten
------------------

Mit der App können Kleiderwarte offenen Bestellungen von Kameradinnen und Kameraden nachverfolgen. So verlieren sie nicht den Überblick über die Bestellungen.

![Screenshot der Bestellungsübersicht](docs/img/screenshot_clothes_orders.png)

Gerät einem Fahrzeug zuordnen
-----------------------------

Die App wurde vor allem für Fahrzeug-Tablets erstellt. Daher ist eine Grundfunktion, die Login-Daten für das jeweilige Fahrzeug fest einzuspeichern, damit sich dieses immer selbst anmeldet.

# Demo

Eine Live-Demo ist auf https://app.feuerwehr-parkstetten.de sichtbar. Da für die App ein Login benötigt wird, sind die unterstützten Funktionen dort allerdings nicht sichtbar.

# Einrichtung

Zur Einrichtung wird zum einen ein Web-Server benötigt, auf dem die App gehostet werden kann, und es muss ein [Firebase](https://firebase.google.com/)-Projekt erstellt werden, das als Datenbank dient.

## Firebase-Projekt einrichten

Nachdem ein Firebase-Projekt erstellt wurde, muss es über die sogenannte [Console](https://console.firebase.google.com) konfiguriert werden:

- Benutzer werden im Menüpunkt "Authentication" angelegt
- Als Datenbank wird die "Realtime Database" verwendet
  - Zunächst müssen die "Regeln" konfiguriert werden. Diese können aus der Datei [database.rules.json](database.rules.json) kopiert werden
  - In der Datenbank werden die Rollen der Benutzer konfiguriert:
    - Die Liste der möglichen Rollen befindet sich [hier](/src/models/User.ts), deren Berechtigungen sind [hier](/src/acl.ts) zu sehen
    - Die Zuweisung der Rollen erfolgt in folgendem Pfad in der Datenbank: `/users/[UID]/roles/[RoleId]`
      - `[UID]`: ID des Benutzers; kann im Menüpunkt "Authentication" ausgelesen werden
      - `[RoleId]`: Rollen-ID, wie in der oben genannten Datei hinterlegt
      - Der Wert dieses Felds muss `true` sein, damit die Zuweisung als solche erkannt wird
    - Jeder Benutzer kann mehrere Rollen besitzen
  - Die Fahrzeuge müssen ebenfalls manuell in die Datenbank unter dem Pfad `/vehicles/[VehicleId]/` eingetragen werden:
    - `[VehicleId]`: Beliebige ID des Fahrzeugs, wird normalerweise nicht zur Anzeige verwendet
    - Unter diesem Pfad können folgende Unterpunkte für jedes Fahrzeug gesetzt werden:
      - `inServiceSince: [Jahr]` (optional): Wird zur Sortierung verwendet
      - `maxCrewNumber: [max. Mannschaftsstärke]`
      - `name: [Name des Fahrzeugs]`: Wird zur Anzeige verwendet
      - `pictureUrl: [URL zu Bild]` (optional): Bild des Fahrzeugs, das zur Anzeige verwendet werden soll

# Hinweise für Entwickler

Die App ist in TypeScript geschrieben, welches in reguläres JavaScript kompiliert wird. Es baut auf dem Framework [Vue.js](https://vuejs.org/) auf, und verwendet [Vuetify](https://vuetifyjs.com/) für die UI-Komponenten.

Als Backend bzw. Datenbank wird [Firebase](https://firebase.google.com/) eingesetzt, wodurch eine eigene Entwicklung und Wartung des Backends entfällt.

## Entwicklung mit Visual Studio Code

### Einrichtung
- WSL 2 und Docker Desktop installieren ([Anleitung](https://code.visualstudio.com/blogs/2020/07/01/containers-wsl))
- Repository in einem WSL-Ordner clonen

### Öffnen
- Ordner mit VS Code in WSL öffnen
- Dev-Container öffnen (siehe dazu oben verlinkte Anleitung)
- Terminal in VS Code öffnen
  - `npm install` (nur erstmalig und bei Änderungen in NPM Dependencies)
  - `npm start`
