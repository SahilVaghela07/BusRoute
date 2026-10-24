import json
import random
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate
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
        bus_id_param = request.GET.get('busId') or request.POST.get('bus_id')
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

        user_obj = None
        if request.user.is_authenticated:
            user_obj = request.user
        elif email:
            user_obj = User.objects.filter(email__iexact=email.strip()).first()

        booking = Booking.objects.create(
            user=user_obj,
            bus=bus,
            booking_ref=ref_no,
            passenger_name=name,
            passenger_email=email,
            passenger_phone=phone,
            travel_date=date,
            selected_seats=seats,
            total_fare=total_price,
        )

        if request.headers.get('x-requested-with') == 'XMLHttpRequest' or request.content_type == 'application/json':
            return JsonResponse({'success': True, 'booking_ref': ref_no, 'id': booking.id, 'total_fare': total_price})

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

# 5. Login Page (Handles POST and creates session)
def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email', '').strip().lower()
        password = request.POST.get('password', '')

        # Lookup by email or username
        user = User.objects.filter(email__iexact=email).first()
        if not user:
            user = User.objects.filter(username__iexact=email).first()

        if user and user.check_password(password):
            login(request, user)
            display_name = user.first_name or user.username
            return JsonResponse({'success': True, 'name': display_name, 'email': user.email, 'id': user.id})
        else:
            return JsonResponse({'success': False, 'error': 'Invalid email or password. Please try again.'})

    return render(request, 'login.html')

# 6. Register Page (Handles POST and creates Django user in auth_user)
def register_view(request):
    if request.method == 'POST':
        full_name = request.POST.get('full_name', '').strip()
        email = request.POST.get('email', '').strip().lower()
        password = request.POST.get('password', '')
        phone = request.POST.get('phone', '').strip()

        # Check if email is already taken
        if User.objects.filter(email__iexact=email).exists():
            return JsonResponse({'success': False, 'error': 'An account with this email already exists.'})

        # Generate unique username from email
        base_username = email.split('@')[0] if email else 'user'
        base_username = base_username.replace(' ', '_').lower()
        username = base_username
        counter = 1
        while User.objects.filter(username__iexact=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        # Create user in Django database
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=full_name
        )
        login(request, user)

        return JsonResponse({
            'success': True,
            'name': full_name,
            'email': email,
            'phone': phone,
            'id': user.id
        })

    return render(request, 'register.html')

# 7. My Bookings Page
def my_bookings_view(request):
    if request.user.is_authenticated:
        bookings = Booking.objects.filter(user=request.user).order_by('-created_at')
    else:
        bookings = Booking.objects.all().order_by('-created_at')

    bookings_data = []
    for b in bookings:
        dept = b.bus.departure_time.strftime('%H:%M') if hasattr(b.bus.departure_time, 'strftime') else str(b.bus.departure_time)[:5]
        date_str = b.travel_date.strftime('%Y-%m-%d') if hasattr(b.travel_date, 'strftime') else str(b.travel_date)
        bookings_data.append({
            'bookingRef': b.booking_ref,
            'busId': b.bus.bus_number,
            'operator': b.bus.operator,
            'busType': b.bus.bus_type,
            'from': b.bus.from_city,
            'to': b.bus.to_city,
            'departure': dept,
            'date': date_str,
            'passengers': len(str(b.selected_seats).split(',')),
            'selectedSeats': [s.strip() for s in str(b.selected_seats).split(',')],
            'totalFare': b.total_fare,
            'passengerName': b.passenger_name,
            'passengerEmail': b.passenger_email,
            'passengerPhone': b.passenger_phone,
        })

    return render(request, 'my-bookings.html', {
        'bookings_json': json.dumps(bookings_data)
    })
