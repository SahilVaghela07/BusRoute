# BusRoute — Frontend

**Experimental Evaluation of Bus Reservation Form Processing Using GET and POST Methods in Django**

> **Academic Project** | Frontend Only | HTML5 · CSS3 · Vanilla JavaScript

---

## Project Objective

BusRoute is a web-based bus reservation frontend built as an academic project to
experimentally evaluate how HTTP **GET** and **POST** methods work when processing
reservation forms in a Django web application.

The frontend demonstrates:
- How a GET form places search parameters visibly in the URL
- How a POST form submits passenger data in the request body (not in the URL)
- The correct use of each method in a real-world bus booking context

**No real backend or database is included in this stage.**

---

## Features

| Feature | Status |
|---|---|
| Bus search form (GET method) | ✅ Frontend complete |
| Search results page with bus cards | ✅ Frontend complete |
| Seat selection (interactive sample layout) | ✅ Frontend complete |
| Passenger booking form (POST method) | ✅ Frontend complete |
| Demo booking confirmation | ✅ Frontend complete |
| GET vs POST experimental lab | ✅ Frontend complete |
| Responsive design (mobile, tablet, desktop) | ✅ Complete |
| Form validation | ✅ Complete |
| Sample mock data (15 buses, 15 routes, 6 popular routes) | ✅ Complete |
| Real Django backend | ❌ Not yet built |
| Real database | ❌ Not yet built |
| Real seat availability | ❌ Not yet built — sample data only |
| Real booking confirmation | ❌ Not yet built |

---

## Technologies

- **HTML5** — Semantic markup, accessible forms
- **CSS3** — Custom properties, responsive layouts, Flexbox and Grid
- **Vanilla JavaScript** — DOM manipulation, URLSearchParams, sessionStorage
- **Google Fonts** — Inter typeface
- No frameworks, no npm packages, no build tools

---

## Folder Structure

```
BusRoute/
│
├── index.html              ← Home page (search form with GET method)
├── buses.html              ← Bus search results page
├── booking.html            ← Seat selection + passenger form (POST method)
├── confirmation.html       ← Demo booking confirmation
├── method-lab.html         ← GET vs POST experimental lab
│
├── assets/
│   ├── css/
│   │   └── style.css       ← All styles (18 organised sections)
│   └── js/
│       ├── data.js         ← Sample bus data and helper functions
│       └── app.js          ← All frontend interaction logic
│
├── README.md               ← This file
└── BACKEND_INTEGRATION_GUIDE.md ← Step-by-step Django backend guide
```

---

## How to Launch the Frontend Locally

**No server or installation required.** Simply open the files in a browser.

### Option 1 — Double-click (simplest)

Double-click `index.html` in Windows Explorer.
The browser will open it using the `file://` protocol.

### Option 2 — VS Code Live Server (recommended)

If you use Visual Studio Code:

1. Install the **Live Server** extension by Ritwick Dey
2. Right-click `index.html` in the VS Code Explorer panel
3. Select **"Open with Live Server"**
4. The site opens at `http://127.0.0.1:5500`

This approach avoids some browser security restrictions on `file://` URLs.

### Option 3 — Python HTTP Server

If you have Python installed, open a terminal in the `BusRoute` folder and run:

```bash
# Python 3
python -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

---

## How to Test the Sample Bus Search

1. Open `index.html`
2. In the search form, select a **From** city (e.g. **Anand**)
3. Select a **To** city (e.g. **Ahmedabad**)
4. Pick any future date
5. Enter a passenger count (e.g. **2**)
6. Click **Search Buses**
7. Observe the URL — it will look like:
   `buses.html?from=Anand&to=Ahmedabad&date=2026-11-10&passengers=2`
8. The results page displays matching buses from the sample data

**Routes that have sample buses:**

| From | To |
|---|---|
| Ahmedabad | Surat |
| Ahmedabad | Rajkot |
| Ahmedabad | Baroda (Vadodara) |
| Anand | Ahmedabad |
| Anand | Surat |
| Baroda (Vadodara) | Ahmedabad |
| Surat | Ahmedabad |
| Rajkot | Ahmedabad |
| Gandhinagar | Surat |

Any other combination will show an empty results state (this is by design).

---

## How to Test the Booking Simulation

1. Search for buses (e.g. Ahmedabad → Surat)
2. On the results page, click **Select Seats** on any bus card
3. On the booking page, click available seats (white/blue) to select them
4. Fill in your name, email (any valid format), and phone (10-digit Indian mobile)
5. Click **Confirm Booking (Demo)**
6. You will be taken to the confirmation page with a demo booking reference

**Important:** This is a frontend-only simulation. No data is sent to any server.
Session data is stored temporarily in `sessionStorage` and is cleared when you close the tab.

---

## How to Access the GET vs POST Laboratory

Navigate to `method-lab.html` or click **GET vs POST Lab** in the navigation bar.

The lab includes:

- **Introduction** — Plain-language explanation of GET and POST
- **GET Experiment** — Submit a form and watch the URL change
- **POST Experiment** — Submit a simulated POST form and see data in the results panel
- **Comparison Table** — 14-row comparison of GET and POST properties
- **Observations** — 8 test cases with expected and observed results

---

## Current Limitations

1. **No real backend** — All data is static JavaScript mock data
2. **No real database** — Seat availability is fixed sample data, not live
3. **No real POST transaction** — JavaScript intercepts the form submit for simulation
4. **No real authentication** — No user login or session management
5. **No payment processing** — Fare is calculated for display only
6. **No email confirmation** — No emails are sent
7. **sessionStorage only** — Booking data is lost when the tab is closed
8. **Sample routes only** — Only routes present in `data.js` return results
9. **No CSRF token** — Will be added when Django templates are implemented

---

## Explanation: Frontend Does Not Use a Real Backend

This frontend is intentionally backend-free. It was built this way so that:

- You can understand the complete frontend code before adding complexity
- Each page can be independently inspected and learned from
- The Django backend can be added one step at a time

The JavaScript mock data in `assets/js/data.js` will eventually be replaced
by data returned from Django views (as template context variables or JSON responses).
The static HTML pages will be converted into Django templates.

See `BACKEND_INTEGRATION_GUIDE.md` for the step-by-step plan.

---

## Beginning the Future Django Integration

When you are ready to connect the Django backend:

1. Read `BACKEND_INTEGRATION_GUIDE.md` fully before starting
2. Set up a Python virtual environment
3. Install Django
4. Create the Django project and application
5. Convert the HTML pages to Django templates one at a time
6. Connect the GET search form to a Django view
7. Connect the POST booking form to a Django view with CSRF protection
8. Implement the database models and booking logic

The guide explains each stage in beginner-friendly language with commands and examples.
