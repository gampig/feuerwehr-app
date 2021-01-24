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

# Hinweise für Entwickler

Die App ist in TypeScript geschrieben, welches in reguläres JavaScript kompiliert wird. Es baut auf dem Framework [Vue.js](https://vuejs.org/) auf, und verwendet [Vuetify](https://vuetifyjs.com/) für die UI-Komponenten.

Als Backend bzw. Datenbank wird [Firebase](https://firebase.google.com/) eingesetzt, wodurch eine eigene Entwicklung und Wartung des Backends entfällt.

Installation
------------

- [Projekt in Firebase erstellen](https://firebase.google.com/docs/web/setup)
  - Schritte 1 und 2 durchführen
  - Config-Datei unter `src/firebase/config.ts` speichern
- npm (bzw. Node.js) installieren
- `npm install` ausführen (lädt benötigte Bibliotheken herunter)
- `npm install -g @vue/cli`, um [Vue CLI](https://cli.vuejs.org/) global zu installieren


Lokal starten
-------------

`npm start`
