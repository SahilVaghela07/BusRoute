import json
import random
from django.shortcuts import render, redirect, get_object_or_404
from .models import Bus, Booking

# 1. Home Page
def home_view(request):
    return render(request, 'index.html')

# 2. Search Buses (GET Request)
def buses_view(request):
    from_city = request.GET.get('from', '').strip()
    to_city = request.GET.get('to', '').strip()
    travel_date = request.GET.get('date', '')

    if from_city and to_city:
        bus_list = Bus.objects.filter(from_city__iexact=from_city, to_city__iexact=to_city)
    else:
        bus_list = Bus.objects.all()

    buses_data = []
    for b in bus_list:
        dept = b.departure_time.strftime('%H:%M') if hasattr(b.departure_time, 'strftime') else str(b.departure_time)[:5]
        arr = b.arrival_time.strftime('%H:%M') if hasattr(b.arrival_time, 'strftime') else str(b.arrival_time)[:5]
        buses_data.append({
            'id': b.bus_number,
            'db_id': b.id,
            'operator': b.operator,
            'busType': b.bus_type,
            'from': b.from_city,
            'to': b.to_city,
            'departure': dept,
            'arrival': arr,
            'duration': b.duration,
            'fare': b.fare,
            'totalSeats': b.total_seats,
            'availableSeats': max(1, b.total_seats - 12),
            'rating': 4.5,
            'amenities': ['AC', 'WiFi', 'Charging Point'] if 'AC' in b.bus_type else ['Water Bottle', 'Comfort Seating'],
        })

    context = {
        'buses': bus_list,
        'buses_json': json.dumps(buses_data),
        'from_city': from_city,
        'to_city': to_city,
        'travel_date': travel_date,
    }
    return render(request, 'buses.html', context)

# 3. Book Seat (POST Request)
def booking_view(request, bus_id=None):
    if bus_id:
        bus = get_object_or_404(Bus, id=bus_id)
    else:
        bus_id_param = request.GET.get('busId')
        if bus_id_param:
            bus = Bus.objects.filter(bus_number__iexact=bus_id_param).first() or Bus.objects.first()
        else:
            bus = Bus.objects.first()

    travel_date = request.GET.get('date', '2026-11-10')

    if request.method == 'POST':
        name = request.POST.get('passenger_name')
        email = request.POST.get('passenger_email')
        phone = request.POST.get('passenger_phone')
        seats = request.POST.get('selected_seats', '1')
        date = request.POST.get('travel_date') or travel_date

        seat_count = len(seats.split(',')) if ',' in seats else 1
        total_price = seat_count * (bus.fare if bus else 100)
        ref_no = f"BR{random.randint(100000, 999999)}"

        booking = Booking.objects.create(
            user=request.user if request.user.is_authenticated else None,
            bus=bus,
            booking_ref=ref_no,
            passenger_name=name,
            passenger_email=email,
            passenger_phone=phone,
            travel_date=date,
            selected_seats=seats,
            total_fare=total_price,
        )

        return redirect('confirmation', booking_id=booking.id)

    # If GET, query database for seats already booked for this bus and date
    booked_records = Booking.objects.filter(bus=bus, travel_date=travel_date)
    booked_seats = []
    for br in booked_records:
        for s in str(br.selected_seats).split(','):
            s = s.strip()
            if s.isdigit():
                booked_seats.append(int(s))

    # Format selected bus for frontend JSON
    bus_data = {}
    if bus:
        dept = bus.departure_time.strftime('%H:%M') if hasattr(bus.departure_time, 'strftime') else str(bus.departure_time)[:5]
        arr = bus.arrival_time.strftime('%H:%M') if hasattr(bus.arrival_time, 'strftime') else str(bus.arrival_time)[:5]
        bus_data = {
            'id': bus.bus_number,
            'db_id': bus.id,
            'operator': bus.operator,
            'busType': bus.bus_type,
            'from': bus.from_city,
            'to': bus.to_city,
            'departure': dept,
            'arrival': arr,
            'duration': bus.duration,
            'fare': bus.fare,
            'totalSeats': bus.total_seats,
            'availableSeats': max(1, bus.total_seats - len(booked_seats) - 10),
            'rating': 4.5,
            'bookedSeats': booked_seats,
        }

    return render(request, 'booking.html', {
        'bus': bus,
        'bus_json': json.dumps(bus_data),
        'travel_date': travel_date,
    })

# 4. Confirmation Page
def confirmation_view(request, booking_id=None):
    booking = None
    if booking_id:
        booking = get_object_or_404(Booking, id=booking_id)
    return render(request, 'confirmation.html', {'booking': booking})

# 5. Login Page
def login_view(request):
    return render(request, 'login.html')

# 6. Register Page
def register_view(request):
    return render(request, 'register.html')

# 7. My Bookings Page
def my_bookings_view(request):
    return render(request, 'my-bookings.html')
