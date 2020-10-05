# Warum Karte nicht funktioniert
Karte verwendet [Phonetrack](https://gitlab.com/eneiluj/phonetrack-oc): nextcloud/index.php/apps/phonetrack/api/getlastpositions/TOKEN

Dieser Endpoint erlaubt aber keinen CORS, womit der Request fehlschlägt. Mögliche Lösungen:

## Header always set Access-Control-Allow-Origin "..."
Ist mit all-inkl scheinbar nicht möglich

## @CORS zu PHP-Code von Phonetrack hinzufügen
Siehe [hier](https://docs.nextcloud.com/server/stable/developer_manual/app/requests/api.html).
Dieser müsste zu der [betreffenden Funktion](https://gitlab.com/eneiluj/phonetrack-oc/-/blob/a108a2738253a5fdfc1c2fb5e987dff61382feb4/lib/Controller/PageController.php#L4332) von Phonetrack hinzugefügt werden.

## Eigene App schreiben
Um den Access-Control-Allow-Origin Header zu setzen, könnte eine eigene kleine App entwickelt werden, die diesen Header vor Requests zu Phonetrack setzt.
Vergleiche mit [hier](https://gitlab.tugraz.at/dbp/nextcloud/webapppassword/-/blob/cd506b168c9eb8ed668c471682443f260a0d3038/lib/Connector/Sabre/CorsPlugin.php)


# To-Dos
- Karte befindet sich vor Drawer!
- OpenFireMap integrieren
- BayernAtlas integrieren?
- Aktuelle Position anzeigen
