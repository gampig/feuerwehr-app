import json
from datetime import datetime
import csv

input_filename = 'data.json'
output_filename = 'Statistik.csv'

with open(input_filename, encoding='utf-8') as f:
    data = json.load(f)

vehicles = data['vehicles']

people = data['people'].keys()
peopleWithoutComma = [p.replace(', ', ' ') for p in people]

crew = dict()
for callout_id, callout in data['crew'].items():
    crew[callout_id] = dict()
    if 'standby' in callout:
        for person in callout['standby']:
            crew[callout_id][person] = 'Bereitschaft'
    if 'vehicles' in callout:
        for vehicle_id, group in callout['vehicles'].items():
            for person in group:
                crew[callout_id][person] = vehicles[vehicle_id]['name']

headers = [
    'Datum',
    'Stichwort',
    'Schlagwort',
    'Adresse',
    'Brand',
    'THL',
    'UG-ÖEL',
]
headers.extend(peopleWithoutComma)
headers.extend([
    'Einsatzbeginn',
    'Einsatzende'
])
headers.extend(['Einsatzende ' + v['name'] for v in vehicles.values()])


class Callout:
    def __init__(self, callout_id, callout_dict) -> None:
        self.id = callout_id
        self.vehicles = self.get_field(callout_dict, 'vehicles', dict())
        self.crew = self.get_field(crew, callout_id, dict())
        self.alarmTime = callout_dict['alarmTime']
        self.endTime = max([v['endTime'] for v in self.vehicles.values()]) if len(
            self.vehicles) > 0 else 0
        self.keyword = self.get_field(callout_dict, 'keyword')
        self.catchphrase = self.get_field(callout_dict, 'catchphrase')
        self.address = self.get_field(callout_dict, 'address')
        self.types = self.get_field(callout_dict, 'type')

    def serialize(self):
        c = [
            datetime.fromtimestamp(self.alarmTime).strftime('%d.%m.'),
            self.keyword,
            self.catchphrase,
            self.address,
            self.check_type('Brand'),
            self.check_type('THL'),
            self.check_type('UG-ÖEL'),
        ]
        c.extend(self.serialize_crew())
        c.extend([
            self.format_datetime(self.alarmTime),
            self.format_datetime(self.endTime)
        ])
        c.extend([self.format_datetime(self.vehicles[v]['endTime'])
                  if v in self.vehicles else '' for v in vehicles])
        return c

    def serialize_crew(self):
        return [self.crew[p] if p in self.crew else '' for p in people]

    def format_datetime(self, timestamp):
        return datetime.fromtimestamp(timestamp).strftime('%d.%m.%Y %H:%M') if timestamp > 0 else ''

    def check_type(self, type_name):
        return 'x' if type_name in self.types else ''

    def get_field(self, d, field, default_retval=''):
        return d[field] if field in d else default_retval


callouts = [Callout(callout_id, callout).serialize()
            for callout_id, callout in data['callouts'].items()]

with open(output_filename, 'w', encoding='utf-8-sig', newline='\n') as f:
    csvwriter = csv.writer(f, delimiter=';')
    csvwriter.writerow(headers)
    csvwriter.writerows(callouts)

print(f"Exported {len(callouts)} entries to {output_filename}.")
