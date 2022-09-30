download_database() {
	firebase database:get / > data.json
}

convert_database() {
	python3 convert_callouts_to_csv.py
}

echo "Firebase-Datenbank herunterladen..."
download_database

if [ $? -ne 0 ]; then
	echo "Konnte Datenbank nicht herunterladen, versuche Anmeldung bei Firebase..."
	firebase login --no-localhost

	if [ $? -ne 0 ]; then
		echo "Fehler: Konnte nicht bei Firebase anmelden."
		exit 1
	fi

	download_database

	if [ $? -ne 0 ]; then
		echo "Fehler: Konnte Datenbank nicht herunterladen."
		exit 1
	fi
fi

echo "Datenbank in CSV-Datei konvertieren..."
convert_database
