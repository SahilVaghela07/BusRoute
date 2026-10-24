# populate_buses.py - Add sample buses to SQLite database
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'busroute_project.settings')
django.setup()

from reservations.models import Bus

sample_buses = [
    {
        "bus_number": "BUS001",
        "operator": "Gujarat Travels",
        "bus_type": "AC Sleeper",
        "from_city": "Ahmedabad",
        "to_city": "Surat",
        "departure_time": "06:00",
        "arrival_time": "10:30",
        "duration": "4h 30m",
        "fare": 450,
        "total_seats": 40
    },
    {
        "bus_number": "BUS002",
        "operator": "Patel Express",
        "bus_type": "Non-AC Seater",
        "from_city": "Ahmedabad",
        "to_city": "Surat",
        "departure_time": "07:30",
        "arrival_time": "12:00",
        "duration": "4h 30m",
        "fare": 280,
        "total_seats": 50
    },
    {
        "bus_number": "BUS003",
        "operator": "Neeta Travels",
        "bus_type": "AC Seater",
        "from_city": "Ahmedabad",
        "to_city": "Surat",
        "departure_time": "09:00",
        "arrival_time": "13:00",
        "duration": "4h 00m",
        "fare": 380,
        "total_seats": 45
    },
    {
        "bus_number": "BUS004",
        "operator": "RapidBus",
        "bus_type": "Volvo Multi-Axle",
        "from_city": "Ahmedabad",
        "to_city": "Surat",
        "departure_time": "22:00",
        "arrival_time": "02:30",
        "duration": "4h 30m",
        "fare": 650,
        "total_seats": 40
    },
    {
        "bus_number": "BUS005",
        "operator": "Shyam Coaches",
        "bus_type": "AC Sleeper",
        "from_city": "Anand",
        "to_city": "Ahmedabad",
        "departure_time": "06:30",
        "arrival_time": "08:00",
        "duration": "1h 30m",
        "fare": 120,
        "total_seats": 35
    },
    {
        "bus_number": "BUS006",
        "operator": "Gujarat Travels",
        "bus_type": "Non-AC Seater",
        "from_city": "Anand",
        "to_city": "Ahmedabad",
        "departure_time": "08:15",
        "arrival_time": "09:45",
        "duration": "1h 30m",
        "fare": 80,
        "total_seats": 50
    }
]

created_count = 0
for b in sample_buses:
    obj, created = Bus.objects.get_or_create(
        bus_number=b["bus_number"],
        defaults=b
    )
    if created:
        created_count += 1

print(f"Successfully added {created_count} sample buses to the database!")
