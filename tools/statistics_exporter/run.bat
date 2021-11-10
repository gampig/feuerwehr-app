@echo off

echo Downloading database...
call firebase database:get / > data.json

echo Converting database to CSV...
call python convert_callouts_to_csv.py
