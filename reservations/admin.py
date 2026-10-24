from django.contrib import admin
from .models import Bus, Booking

# Register your models here.

@admin.register(Bus)
class BusAdmin(admin.ModelAdmin):
    list_display = ('bus_number', 'operator', 'bus_type', 'from_city', 'to_city', 'departure_time', 'arrival_time', 'fare', 'total_seats')
    list_filter = ('bus_type', 'from_city', 'to_city')
    search_fields = ('bus_number', 'operator', 'from_city', 'to_city')

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('booking_ref', 'passenger_name', 'passenger_phone', 'bus', 'travel_date', 'selected_seats', 'total_fare', 'created_at')
    list_filter = ('travel_date', 'created_at')
    search_fields = ('booking_ref', 'passenger_name', 'passenger_email', 'passenger_phone')
