from django.db import models

# Create your models here.
from django.contrib.auth.models import User

# 1. Bus Model (stores available buses)
class Bus(models.Model):
    bus_number = models.CharField(max_length=20, unique=True)
    operator = models.CharField(max_length=100)
    bus_type = models.CharField(max_length=50) # e.g. "AC Sleeper"
    from_city = models.CharField(max_length=50)
    to_city = models.CharField(max_length=50)
    departure_time = models.TimeField()
    arrival_time = models.TimeField()
    duration = models.CharField(max_length=20) # e.g. "4h 30m"
    fare = models.IntegerField()
    total_seats = models.IntegerField(default=40)

    def __str__(self):
        return f"{self.operator} ({self.from_city} -> {self.to_city})"

# 2. Booking Model (stores passenger reservations)
class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE)
    booking_ref = models.CharField(max_length=20, unique=True)
    passenger_name = models.CharField(max_length=100)
    passenger_email = models.EmailField()
    passenger_phone = models.CharField(max_length=15)
    travel_date = models.DateField()
    selected_seats = models.CharField(max_length=100) # e.g. "12, 14"
    total_fare = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.booking_ref} - {self.passenger_name}"