import os
import csv
import json

__location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))

keywords = dict()

with open(os.path.join(__location__, "keywords.csv"), encoding='utf_8_sig') as file:
    reader = csv.reader(file, delimiter=';')
    for row in reader:
        keyword = row[0].strip()
        catchphrase = row[1].strip()
        if keyword not in keywords:
            keywords[keyword] = [catchphrase]
        else:
            keywords[keyword].append(catchphrase)

with open(os.path.join(__location__, "../../src/assets/keywords.json"), "w", encoding='utf_8') as file:
    json.dump(keywords, file)
