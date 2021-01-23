# Problem
Benutzer brauchen Accounts.
Es gibt aber schon zwei (Homepage und Cloud) / drei (mit Kleiderwart-Seite) Login-Systeme.

# Lösung
## Ansatz 1: Separat lassen
Jeder hat eigenen Account auf jedem dieser Server. Schlechteste Lösung für die Nutzer.

## Ansatz 2: Alle Accounts nur von einem Server
Alle Accounts werden nur bei einem der Server erstellt und verwaltet (z.B. Homepage oder Cloud).
Die anderen Server greifen auf die Benutzer-Tabelle zu.

Aber: Dieser eine Server könnte möglicherweise in Zukunft mit anderem System (z.B. Wordpress statt Drupal) ersetzt werden.
Dann gibt es Problem mit User-Migration (User IDs etc.).
Auch könnte die User-Tabelle mit einem Update verändert werden, sodass die anderen Server nicht mehr darauf zugreifen können.

## Ansatz 3: Eigenen Identity Provider
Es gibt bereits mehrere Protokolle (OAuth2, OpenID Connect, ...), bei denen die Accounts auf einem extra Server liegen, und die Anwendungen sich über diesen Server anmelden.

Problem: Noch eine weitere Anwendung im System, die gewartet werden muss.

## Ansatz 4: Fremder Identity Provider
Es gibt mehrere Anbieter, die einen ID-Provider-Server hosten. Dieser ist meist kostenlos bis zu einer gewissen Menge an Accounts.

Problem: Abhängigkeit von externem Anbieter!