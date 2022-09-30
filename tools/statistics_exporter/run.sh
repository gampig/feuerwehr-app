SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
DATABASE_FILE=$SCRIPT_DIR/output/Datenbank.json
OUTPUT_FILE=$SCRIPT_DIR/output/Mannschaftsbuch.csv

download_database() {
	firebase database:get / > $DATABASE_FILE
}

convert_database() {
	python3 $SCRIPT_DIR/scripts/convert_callouts_to_csv.py "$DATABASE_FILE" "$OUTPUT_FILE"
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
