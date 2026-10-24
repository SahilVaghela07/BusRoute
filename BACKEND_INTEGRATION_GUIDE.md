# BusRoute — Backend Integration Guide

**A step-by-step mentor guide for connecting your BusRoute frontend to a Django backend.**

> This guide is written for a beginner. Each stage explains **why** you are doing it,
> **what** you will create, **where** the files go, the **exact commands** to run, and
> how to **test** and **fix common mistakes**.

---

## Before You Start

Make sure you have:
- Python 3.10 or newer installed (`python --version`)
- A code editor (VS Code is recommended)
- The BusRoute frontend files in `c:\Downloads\CODING\BusRoute\`

**Read this entire guide before writing any code.** Understanding the full picture
will save you a lot of debugging time.

---

## Stage 1 — Create the Python Virtual Environment and Install Django

### Why?

A virtual environment keeps Django and its dependencies isolated from other Python
projects on your computer. This prevents version conflicts.

### What to Create

A folder called `venv` inside your project directory.

### Commands

Open a terminal (PowerShell or Command Prompt) inside your `BusRoute` folder:

```powershell
# Create the virtual environment
python -m venv venv

# Activate it (Windows PowerShell)
venv\Scripts\Activate.ps1

# If you get a permissions error, run this first:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Install Django
pip install django

# Confirm it worked
python -m django --version
```

### How to Test

You should see a Django version number (e.g. `5.1.x`) with no errors.

### Common Mistakes

- **"python not found"** — Python is not in your PATH. Reinstall Python and tick the
  "Add Python to PATH" checkbox.
- **"Activate.ps1 cannot be loaded"** — Run the `Set-ExecutionPolicy` command above.
- Forgetting to activate the virtual environment. The terminal prompt should show
  `(venv)` at the start when the environment is active.

---

## Stage 2 — Create the Django Project and Application

### Why?

A **Django project** is the container for your entire website (settings, URL routing).
A **Django app** is a module inside the project that handles one part of the site —
in our case, the bus reservation functionality.

### What to Create

```
BusRoute/
├── venv/                   ← Virtual environment (already created)
├── busroute_project/       ← Django project folder (NEW)
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── busapp/                 ← Django application folder (NEW)
│   ├── migrations/
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   └── templates/
└── manage.py               ← Django management script (NEW)
```

### Commands

```powershell
# Make sure the virtual environment is active (venv)

# Create the Django project (the dot means "in current directory")
django-admin startproject busroute_project .

# Create the application
python manage.py startapp busapp
```

### Register the App

Open `busroute_project/settings.py` and find the `INSTALLED_APPS` list.
Add `'busapp'` to it:

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'busapp',          # ← Add this line
]
```

### How to Test

```powershell
python manage.py runserver
```

Open `http://127.0.0.1:8000` in your browser. You should see the Django welcome page.

### Common Mistakes

- **"ModuleNotFoundError: No module named 'django'"** — Your virtual environment is not activated.
- Forgetting to add `'busapp'` to `INSTALLED_APPS` — Django will not find your models or templates.

---

## Stage 3 — Understand Which Files Become Django Templates vs. Static Assets

### Why?

Django separates "static" files (CSS, JavaScript, images) from "template" files (HTML).
You need to understand which frontend files go where.

### The Mapping

| BusRoute Frontend File | In Django |
|---|---|
| `index.html` | `busapp/templates/busapp/index.html` (Django template) |
| `buses.html` | `busapp/templates/busapp/buses.html` (Django template) |
| `booking.html` | `busapp/templates/busapp/booking.html` (Django template) |
| `confirmation.html` | `busapp/templates/busapp/confirmation.html` (Django template) |
| `method-lab.html` | `busapp/templates/busapp/method_lab.html` (Django template) |
| `assets/css/style.css` | `busapp/static/busapp/css/style.css` (static file) |
| `assets/js/app.js` | `busapp/static/busapp/js/app.js` (static file) |
| `assets/js/data.js` | Eventually replaced by Django views — may not be needed |

### Important

Django templates are HTML files that can contain special `{{ variable }}` and
`{% tag %}` syntax. Your current HTML files have none of this yet — that is fine.
You will add the Django syntax in Stage 9.

---

## Stage 4 — Plan Your Database Entities (Models)

### Why?

A database stores the real bus schedules, seat availability, and bookings.
You need to decide what information to store and how the pieces relate to each other.

### Planned Entities

#### 1. `Operator`
Represents a bus company.

| Field | Type | Notes |
|---|---|---|
| `id` | AutoField (PK) | Auto-generated |
| `name` | CharField | e.g. "Gujarat Travels" |
| `contact_email` | EmailField | Optional |

#### 2. `Bus`
Represents a physical bus belonging to an operator.

| Field | Type | Notes |
|---|---|---|
| `id` | AutoField (PK) | Auto-generated |
| `operator` | ForeignKey → Operator | Which company owns the bus |
| `bus_type` | CharField | e.g. "AC Sleeper", "Non-AC Seater" |
| `total_seats` | PositiveIntegerField | Total physical seats |
| `registration` | CharField | Vehicle registration number (optional) |

#### 3. `BusSchedule`
Represents one journey (a specific bus on a specific route on a specific date).

| Field | Type | Notes |
|---|---|---|
| `id` | AutoField (PK) | Auto-generated |
| `bus` | ForeignKey → Bus | Which bus |
| `from_city` | CharField | Departure city |
| `to_city` | CharField | Destination city |
| `departure_time` | TimeField | e.g. 06:00 |
| `arrival_time` | TimeField | e.g. 10:30 |
| `journey_date` | DateField | The actual travel date |
| `fare` | DecimalField | Fare per seat in INR |
| `amenities` | TextField | Comma-separated list or JSONField |

#### 4. `Booking`
Represents a passenger's reservation.

| Field | Type | Notes |
|---|---|---|
| `id` | AutoField (PK) | Auto-generated |
| `booking_ref` | CharField | Unique reference code (e.g. BR7891234) |
| `schedule` | ForeignKey → BusSchedule | Which journey was booked |
| `passenger_name` | CharField | Full name |
| `passenger_email` | EmailField | Email address |
| `passenger_phone` | CharField | 10-digit mobile number |
| `selected_seats` | CharField | Comma-separated seat numbers |
| `total_fare` | DecimalField | Calculated at time of booking |
| `created_at` | DateTimeField | When the booking was made |

### Relationships

```
Operator ──< Bus ──< BusSchedule ──< Booking
```

One operator has many buses.
One bus has many schedules (one per journey date).
One schedule has many bookings (one per passenger group).

### Design Note

We do not store a separate Passenger model to avoid storing unnecessary personal
data across multiple bookings. The passenger details live in the Booking record.
If you need a passenger history feature later, you can add a Passenger model then.

---

## Stage 5 — Choose and Configure the Database

### Why?

Django needs a database to store your models. It supports SQLite, PostgreSQL,
MySQL, and others.

### Recommendation: Start with SQLite

SQLite stores the entire database in one file (`db.sqlite3`). It requires zero
configuration and is built into Python. It is perfect for development and for a
small academic project.

No changes to `settings.py` are needed — SQLite is Django's default.

```python
# busroute_project/settings.py (default — no changes needed for SQLite)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

### Switching to PostgreSQL Later

When you are ready to deploy to a real server, you can switch:

```bash
pip install psycopg2-binary
```

```python
# busroute_project/settings.py (PostgreSQL)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'busroute_db',
        'USER': 'your_db_user',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

---

## Stage 6 — Define Django Models

### Why?

Django models are Python classes that define the structure of your database tables.
Django creates the actual SQL tables from your model definitions.

### Create the Models

Open `busapp/models.py` and write:

```python
from django.db import models
import uuid


class Operator(models.Model):
    name = models.CharField(max_length=100)
    contact_email = models.EmailField(blank=True)

    def __str__(self):
        return self.name


class Bus(models.Model):
    BUS_TYPES = [
        ('AC_SLEEPER', 'AC Sleeper'),
        ('AC_SEATER', 'AC Seater'),
        ('NON_AC_SEATER', 'Non-AC Seater'),
        ('VOLVO', 'Volvo Multi-Axle'),
        ('SEMI_SLEEPER', 'AC Semi-Sleeper'),
    ]
    operator = models.ForeignKey(Operator, on_delete=models.CASCADE, related_name='buses')
    bus_type = models.CharField(max_length=50, choices=BUS_TYPES)
    total_seats = models.PositiveIntegerField(default=40)
    registration = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return f"{self.operator.name} — {self.get_bus_type_display()}"


class BusSchedule(models.Model):
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE, related_name='schedules')
    from_city = models.CharField(max_length=100)
    to_city = models.CharField(max_length=100)
    departure_time = models.TimeField()
    arrival_time = models.TimeField()
    journey_date = models.DateField()
    fare = models.DecimalField(max_digits=8, decimal_places=2)
    amenities = models.TextField(blank=True, help_text='Comma-separated: AC,WiFi,Blanket')
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=4.0)

    def available_seats(self):
        """Returns the number of seats not yet booked on this schedule."""
        booked_count = self.bookings.count()  # counts related Booking records
        return self.bus.total_seats - booked_count

    def __str__(self):
        return f"{self.from_city} → {self.to_city} on {self.journey_date} ({self.departure_time})"


def generate_booking_ref():
    """Generate a unique 10-character booking reference."""
    return 'BR' + str(uuid.uuid4()).replace('-', '').upper()[:8]


class Booking(models.Model):
    booking_ref = models.CharField(max_length=20, unique=True, default=generate_booking_ref)
    schedule = models.ForeignKey(BusSchedule, on_delete=models.PROTECT, related_name='bookings')
    passenger_name = models.CharField(max_length=200)
    passenger_email = models.EmailField()
    passenger_phone = models.CharField(max_length=15)
    selected_seats = models.CharField(max_length=200, help_text='Comma-separated seat numbers')
    total_fare = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.booking_ref} — {self.passenger_name}"
```

### Create and Apply Migrations

After defining your models, run:

```bash
# Create migration files (tells Django what changed)
python manage.py makemigrations

# Apply migrations (creates the actual database tables)
python manage.py migrate
```

### How to Test

```bash
python manage.py shell
```

Inside the shell:

```python
from busapp.models import Operator
op = Operator(name="Gujarat Travels")
op.save()
print(Operator.objects.all())   # Should print: <QuerySet [<Operator: Gujarat Travels>]>
exit()
```

### Common Mistakes

- Forgetting to run `makemigrations` after changing models — the database will be out of sync.
- Forgetting to run `migrate` after `makemigrations` — the tables will not be created.

---

## Stage 7 — Create Django Views

### Why?

Views are Python functions (or classes) that receive HTTP requests and return HTTP responses.
Each page in your application needs a corresponding view.

### Views to Create

Open `busapp/views.py` and create these views:

```python
from django.shortcuts import render, get_object_or_404, redirect
from django.utils import timezone
from .models import BusSchedule, Booking


def home(request):
    """
    Home page view.
    Renders index.html with no special context.
    GET method is used by the search form on this page.
    """
    return render(request, 'busapp/index.html')


def bus_search_results(request):
    """
    Bus search results view.
    Reads GET parameters: from, to, date, passengers.
    Filters BusSchedule records and passes them to the template.

    Django reads GET parameters with: request.GET.get("from")
    """
    from_city = request.GET.get('from', '').strip()
    to_city = request.GET.get('to', '').strip()
    date_str = request.GET.get('date', '')
    passengers = int(request.GET.get('passengers', 1))

    schedules = BusSchedule.objects.none()
    error = None

    if from_city and to_city and date_str:
        try:
            travel_date = timezone.datetime.strptime(date_str, '%Y-%m-%d').date()
            schedules = BusSchedule.objects.filter(
                from_city__iexact=from_city,
                to_city__iexact=to_city,
                journey_date=travel_date,
            ).select_related('bus', 'bus__operator')
        except ValueError:
            error = "Invalid date format."
    else:
        error = "Please provide all search parameters."

    context = {
        'schedules': schedules,
        'from_city': from_city,
        'to_city': to_city,
        'date_str': date_str,
        'passengers': passengers,
        'error': error,
    }
    return render(request, 'busapp/buses.html', context)


def booking_form(request):
    """
    Booking form view.
    Shows the seat selection and passenger form for a selected schedule.
    """
    schedule_id = request.GET.get('scheduleId')
    passengers = int(request.GET.get('passengers', 1))
    date_str = request.GET.get('date', '')

    schedule = get_object_or_404(BusSchedule, id=schedule_id)

    context = {
        'schedule': schedule,
        'passengers': passengers,
        'date_str': date_str,
    }
    return render(request, 'busapp/booking.html', context)


def booking_submit(request):
    """
    Booking submission view.
    Handles the POST request from the booking form.
    Validates data, creates a Booking record, and redirects to confirmation.

    IMPORTANT: This view only accepts POST requests.
    Django's CSRF middleware verifies the CSRF token automatically.
    """
    if request.method != 'POST':
        return redirect('home')

    # Read form data from request.POST
    schedule_id = request.POST.get('schedule_id')
    passenger_name = request.POST.get('passenger_name', '').strip()
    passenger_email = request.POST.get('passenger_email', '').strip()
    passenger_phone = request.POST.get('passenger_phone', '').strip()
    selected_seats = request.POST.get('selected_seats', '').strip()

    schedule = get_object_or_404(BusSchedule, id=schedule_id)

    # --- Server-side validation ---
    errors = []
    if not passenger_name or len(passenger_name) < 2:
        errors.append("Please enter a valid full name.")
    if not passenger_email or '@' not in passenger_email:
        errors.append("Please enter a valid email address.")
    if not passenger_phone or not passenger_phone.isdigit() or len(passenger_phone) != 10:
        errors.append("Please enter a valid 10-digit mobile number.")
    if not selected_seats:
        errors.append("Please select at least one seat.")

    if errors:
        # Re-render the booking form with error messages
        return render(request, 'busapp/booking.html', {
            'schedule': schedule,
            'errors': errors,
        })

    # --- Seat availability check ---
    seats_list = [s.strip() for s in selected_seats.split(',') if s.strip()]
    # In a real application, check that these specific seats are not already booked
    # and use database transactions to prevent race conditions (Stage 12)

    # --- Calculate total fare ---
    num_seats = len(seats_list)
    total_fare = schedule.fare * num_seats

    # --- Create the booking ---
    booking = Booking.objects.create(
        schedule=schedule,
        passenger_name=passenger_name,
        passenger_email=passenger_email,
        passenger_phone=passenger_phone,
        selected_seats=selected_seats,
        total_fare=total_fare,
    )

    # --- Redirect to confirmation page ---
    return redirect('booking_confirmation', booking_ref=booking.booking_ref)


def booking_confirmation(request, booking_ref):
    """
    Booking confirmation view.
    Fetches the booking from the database and renders the confirmation page.
    """
    booking = get_object_or_404(Booking, booking_ref=booking_ref)
    return render(request, 'busapp/confirmation.html', {'booking': booking})


def method_lab(request):
    """
    GET vs POST Method Lab view.
    Handles both GET requests (reading lab_from, lab_to, lab_date)
    and POST requests (lab POST experiment).
    """
    get_params = {}
    post_data = {}
    post_submitted = False

    if request.method == 'POST':
        post_submitted = True
        post_data = dict(request.POST)
        post_data.pop('csrfmiddlewaretoken', None)  # Do not display the CSRF token

    if request.method == 'GET':
        get_params = {
            'lab_from': request.GET.get('lab_from', ''),
            'lab_to': request.GET.get('lab_to', ''),
            'lab_date': request.GET.get('lab_date', ''),
        }

    context = {
        'get_params': get_params,
        'post_data': post_data,
        'post_submitted': post_submitted,
    }
    return render(request, 'busapp/method_lab.html', context)
```

---

## Stage 8 — Configure URL Routing

### Why?

URL routing maps a browser URL to the correct Django view function.

### Create `busapp/urls.py`

This file does not exist yet. Create it:

```python
# busapp/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('buses/', views.bus_search_results, name='bus_search_results'),
    path('booking/', views.booking_form, name='booking_form'),
    path('booking/submit/', views.booking_submit, name='booking_submit'),
    path('confirmation/<str:booking_ref>/', views.booking_confirmation, name='booking_confirmation'),
    path('method-lab/', views.method_lab, name='method_lab'),
]
```

### Update `busroute_project/urls.py`

```python
# busroute_project/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('busapp.urls')),
]
```

### How to Test

Run the server and open these URLs to verify routing works:

| URL | Expected |
|---|---|
| `http://127.0.0.1:8000/` | Home page |
| `http://127.0.0.1:8000/buses/?from=Anand&to=Ahmedabad&date=2026-11-10&passengers=2` | Search results |
| `http://127.0.0.1:8000/method-lab/` | Method lab |

---

## Stage 9 — Convert Static HTML Pages to Django Templates

### Why?

Django templates allow you to use Python variables and logic inside HTML files.
They also enable template inheritance — a shared base layout for all pages.

### Step 1: Create the Template Directory

```
busapp/
└── templates/
    └── busapp/
        ├── base.html           ← Shared layout (nav + footer)
        ├── index.html
        ├── buses.html
        ├── booking.html
        ├── confirmation.html
        └── method_lab.html
```

```bash
mkdir busapp\templates\busapp
```

### Step 2: Create `base.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  {% load static %}
  <link rel="stylesheet" href="{% static 'busapp/css/style.css' %}" />
  <title>{% block title %}BusRoute{% endblock %}</title>
</head>
<body>
  <nav class="nav"><!-- nav content --></nav>

  <main>
    {% block content %}{% endblock %}
  </main>

  <footer class="footer"><!-- footer content --></footer>

  <script src="{% static 'busapp/js/app.js' %}"></script>
</body>
</html>
```

### Step 3: Copy and Adapt Each Page

For each HTML page:
1. Copy the file to `busapp/templates/busapp/`
2. Add `{% extends 'busapp/base.html' %}` at the top
3. Wrap the page content in `{% block content %}...{% endblock %}`
4. Replace `href="assets/css/style.css"` with `{% load static %}{% static '...' %}`
5. Replace `href="index.html"` with `href="{% url 'home' %}"`
6. Replace `href="buses.html"` with `href="{% url 'bus_search_results' %}"`
7. Replace hardcoded bus data with `{% for schedule in schedules %}...{% endfor %}`

### Step 4: Configure Static Files

In `busroute_project/settings.py`:

```python
STATIC_URL = '/static/'

# Tell Django where your static files are located during development
STATICFILES_DIRS = [
    BASE_DIR / 'busapp' / 'static',
]
```

Copy your CSS and JS files:
```
busapp/
└── static/
    └── busapp/
        ├── css/
        │   └── style.css
        └── js/
            └── app.js
            (data.js is no longer needed — Django supplies the data)
```

---

## Stage 10 — Connect the GET Search Form to a Django GET View

### Why?

The search form currently submits to `buses.html`. After converting to Django,
it must submit to the `bus_search_results` view.

### Changes to the Template

In `busapp/templates/busapp/index.html`, update the form:

```html
<!-- Before (static frontend) -->
<form method="GET" action="buses.html">

<!-- After (Django template) -->
<form method="GET" action="{% url 'bus_search_results' %}">
```

### The View Reads GET Parameters

In `busapp/views.py`, the `bus_search_results` view reads:

```python
from_city = request.GET.get('from', '')
to_city = request.GET.get('to', '')
date_str = request.GET.get('date', '')
passengers = int(request.GET.get('passengers', 1))
```

### The Template Renders the Results

In `busapp/templates/busapp/buses.html`:

```html
{% for schedule in schedules %}
  <article class="bus-card">
    <h3>{{ schedule.bus.operator.name }}</h3>
    <p>{{ schedule.from_city }} → {{ schedule.to_city }}</p>
    <p>Departure: {{ schedule.departure_time }}</p>
    <p>Fare: ₹{{ schedule.fare }}</p>
    <p>Available seats: {{ schedule.available_seats }}</p>
    <a href="{% url 'booking_form' %}?scheduleId={{ schedule.id }}&passengers={{ passengers }}">
      Select Seats
    </a>
  </article>
{% empty %}
  <p>No buses found for this route.</p>
{% endfor %}
```

---

## Stage 11 — Connect the Booking Form to a Django POST View

### Why?

The booking form must send passenger data to Django, which saves it to the database.

### Changes to the Template

In `busapp/templates/busapp/booking.html`:

```html
<!-- Before (static frontend) -->
<form method="POST" action="">

<!-- After (Django template) -->
<form method="POST" action="{% url 'booking_submit' %}">
  {% csrf_token %}   ← THIS IS REQUIRED. Without it, Django returns 403 Forbidden.
  <input type="hidden" name="schedule_id" value="{{ schedule.id }}" />
  ...
</form>
```

### Understanding CSRF

CSRF stands for Cross-Site Request Forgery. It is an attack where a malicious website
tricks a logged-in user into submitting a form to your site without their knowledge.

Django prevents this by including a secret token in every POST form.
When the form is submitted, Django checks that the token is valid.
If it is missing or wrong, Django rejects the request with a `403 Forbidden` error.

**The fix is always:** add `{% csrf_token %}` as the first child inside your `<form>` tag.

### The View Reads POST Parameters

```python
passenger_name = request.POST.get('passenger_name', '').strip()
passenger_email = request.POST.get('passenger_email', '').strip()
passenger_phone = request.POST.get('passenger_phone', '').strip()
selected_seats = request.POST.get('selected_seats', '').strip()
```

### Server-Side Validation

Never trust the client. Even with JavaScript validation, always validate again in Django.
A user can disable JavaScript or send a crafted request directly.

Use Django's built-in form validation:

```python
# busapp/forms.py
from django import forms

class BookingForm(forms.Form):
    passenger_name = forms.CharField(min_length=2, max_length=200)
    passenger_email = forms.EmailField()
    passenger_phone = forms.CharField(min_length=10, max_length=10)
    selected_seats = forms.CharField()
    schedule_id = forms.IntegerField()
```

---

## Stage 12 — Implement Database-Backed Booking and Seat Availability

### Why?

The static frontend uses fixed sample data for seat availability.
The real application must check which seats are actually booked before allowing a new booking.

### How to Track Booked Seats

Store seat numbers as a comma-separated string in `Booking.selected_seats`.
Before creating a new booking, collect all already-booked seats for this schedule:

```python
existing_bookings = Booking.objects.filter(schedule=schedule)
already_booked = set()
for b in existing_bookings:
    for seat in b.selected_seats.split(','):
        already_booked.add(seat.strip())

requested_seats = set(s.strip() for s in selected_seats.split(','))
conflict = already_booked & requested_seats

if conflict:
    return render(request, 'busapp/booking.html', {
        'schedule': schedule,
        'errors': [f"Seats {', '.join(conflict)} are already booked. Please choose different seats."],
    })
```

### Preventing Race Conditions (Concurrent Bookings)

If two people try to book the same seat at exactly the same time, both might
pass the availability check before either booking is saved.

The safest approach is to use a **database transaction with select_for_update**:

```python
from django.db import transaction

with transaction.atomic():
    # Lock the schedule row while we check and create the booking
    schedule = BusSchedule.objects.select_for_update().get(id=schedule_id)
    # ... check availability ...
    # ... create booking ...
```

This ensures only one booking can proceed at a time for a given schedule.
Study Django's documentation on `select_for_update()` before implementing this.

---

## Stage 13 — Testing

### Test Cases to Verify

| # | Scenario | Expected Result |
|---|---|---|
| 1 | Search with valid cities and future date | Matching bus schedules appear |
| 2 | Search with same source and destination | Error message shown |
| 3 | Search with past date | No results or error |
| 4 | Search for a route with no schedules | Empty results message |
| 5 | Submit booking with all valid fields | Booking created, redirected to confirmation |
| 6 | Submit booking without selecting seats | Error message shown |
| 7 | Submit booking with invalid email | Server-side validation error |
| 8 | Submit booking without CSRF token | Django returns 403 Forbidden |
| 9 | Submit booking for an already-booked seat | Seat conflict error message |
| 10 | Two simultaneous bookings for the same seat | Only one succeeds (database transaction) |
| 11 | Navigate to confirmation URL with invalid ref | 404 Not Found |
| 12 | GET lab form submitted | Query parameters visible in URL; Django reads them |
| 13 | POST lab form submitted | Data readable from `request.POST`; URL unchanged |

### Running Tests

```bash
python manage.py test busapp
```

Write Django test cases in `busapp/tests.py` using `TestCase` and the test client.

---

## Stage 14 — Run the Django Development Server and Verify

### Start the Server

```bash
python manage.py runserver
```

Open `http://127.0.0.1:8000` in your browser.

### Checklist

- [ ] Home page loads with a working search form
- [ ] Search form submits via GET and shows bus results from the database
- [ ] Clicking "Select Seats" opens the booking page for the correct schedule
- [ ] Seat map shows booked seats (from the database) as unavailable
- [ ] Passenger form validates on submission
- [ ] Booking is saved to the database on POST submission
- [ ] Confirmation page shows data fetched from the database
- [ ] Refreshing the confirmation page does not duplicate the booking
- [ ] Method lab GET experiment shows query parameters
- [ ] Method lab POST experiment (real Django version) shows `request.POST` data

### Checking the Database

```bash
python manage.py shell
```

```python
from busapp.models import Booking
print(Booking.objects.all())
```

Or use the Django admin panel:

```bash
python manage.py createsuperuser
```

Then open `http://127.0.0.1:8000/admin` and log in.

---

## Quick Reference: Key Django Concepts for This Project

| Concept | Description |
|---|---|
| `request.GET` | Dictionary of URL query parameters (from GET forms) |
| `request.POST` | Dictionary of form body data (from POST forms) |
| `request.method` | String: `"GET"` or `"POST"` |
| `{% csrf_token %}` | Required inside every POST form in a Django template |
| `{% url 'view_name' %}` | Generates a URL for a named view |
| `{% static 'path/file' %}` | Generates a URL for a static file (CSS, JS) |
| `{% for item in list %}` | Template loop |
| `{{ variable }}` | Outputs a variable value safely |
| `render(request, template, context)` | Returns an HTML response |
| `redirect('view_name')` | Redirects the browser to another view |
| `get_object_or_404(Model, ...)` | Gets one object or returns 404 |
| `makemigrations` | Creates migration files from model changes |
| `migrate` | Applies migrations to the database |

---

## Summary of All Stages

| Stage | Task |
|---|---|
| 1 | Create virtual environment and install Django |
| 2 | Create Django project and application |
| 3 | Understand templates vs. static files |
| 4 | Plan database entities |
| 5 | Configure the database |
| 6 | Define Django models |
| 7 | Create views for each page |
| 8 | Configure URL routing |
| 9 | Convert HTML pages to Django templates |
| 10 | Connect GET search form to Django view |
| 11 | Connect POST booking form to Django view with CSRF |
| 12 | Implement seat availability and booking creation |
| 13 | Test all scenarios |
| 14 | Run development server and verify end-to-end |

Good luck building the backend! Take it one stage at a time and test thoroughly
before moving to the next stage.
