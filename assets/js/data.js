// BusRoute - Sample Data and Helper Functions

// Cities for From and To dropdowns
const CITIES = [
  "Ahmedabad",
  "Anand",
  "Baroda (Vadodara)",
  "Surat",
  "Rajkot",
  "Gandhinagar",
  "Bhavnagar",
  "Junagadh",
  "Jamnagar",
  "Mehsana",
  "Nadiad",
  "Bharuch",
  "Navsari",
  "Valsad",
  "Morbi",
];

// Bus Operators
const OPERATORS = [
  "Gujarat Travels",
  "Patel Express",
  "Shyam Coaches",
  "RapidBus",
  "SkyLine Travels",
  "Neeta Travels",
  "Mahalaxmi Express",
  "Arrow Travels",
];

// Sample Bus List
const BUS_DATA = [
  {
    id: "BUS001",
    operator: "Gujarat Travels",
    busType: "AC Sleeper",
    from: "Ahmedabad",
    to: "Surat",
    departure: "06:00",
    arrival: "10:30",
    duration: "4h 30m",
    fare: 450,
    totalSeats: 40,
    availableSeats: 18,
    rating: 4.5,
    amenities: ["AC", "WiFi", "Charging Point", "Blanket"],
    unavailableSeats: [1, 2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38, 39, 40, 3, 6, 7, 10, 16, 21],
  },
  {
    id: "BUS002",
    operator: "Patel Express",
    busType: "Non-AC Seater",
    from: "Ahmedabad",
    to: "Surat",
    departure: "07:30",
    arrival: "12:00",
    duration: "4h 30m",
    fare: 280,
    totalSeats: 50,
    availableSeats: 32,
    rating: 3.8,
    amenities: ["Water Bottle", "Blanket"],
    unavailableSeats: [1, 4, 9, 15, 22, 30, 37, 44, 48, 50, 2, 8, 16, 24, 31, 38, 45, 49],
  },
  {
    id: "BUS003",
    operator: "Neeta Travels",
    busType: "AC Seater",
    from: "Ahmedabad",
    to: "Surat",
    departure: "09:00",
    arrival: "13:00",
    duration: "4h 00m",
    fare: 380,
    totalSeats: 45,
    availableSeats: 10,
    rating: 4.2,
    amenities: ["AC", "Charging Point", "Water Bottle"],
    unavailableSeats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 15, 17, 19, 20, 22, 24, 26, 27, 28, 30, 31, 33, 34, 36, 37, 39, 40, 42, 43, 45, 11, 14, 16, 18],
  },
  {
    id: "BUS004",
    operator: "RapidBus",
    busType: "Volvo Multi-Axle",
    from: "Ahmedabad",
    to: "Surat",
    departure: "22:00",
    arrival: "02:30",
    duration: "4h 30m",
    fare: 550,
    totalSeats: 36,
    availableSeats: 24,
    rating: 4.7,
    amenities: ["AC", "WiFi", "Charging Point", "Blanket", "Pillow", "Entertainment"],
    unavailableSeats: [1, 5, 9, 13, 17, 21, 25, 29, 33, 2, 6, 10, 14],
  },
  {
    id: "BUS005",
    operator: "SkyLine Travels",
    busType: "AC Semi-Sleeper",
    from: "Anand",
    to: "Ahmedabad",
    departure: "05:30",
    arrival: "07:00",
    duration: "1h 30m",
    fare: 120,
    totalSeats: 40,
    availableSeats: 28,
    rating: 4.0,
    amenities: ["AC", "Water Bottle"],
    unavailableSeats: [3, 7, 11, 15, 19, 23, 27, 31, 35, 39, 4, 8],
  },
  {
    id: "BUS006",
    operator: "Gujarat Travels",
    busType: "Non-AC Seater",
    from: "Anand",
    to: "Ahmedabad",
    departure: "07:00",
    arrival: "08:45",
    duration: "1h 45m",
    fare: 80,
    totalSeats: 50,
    availableSeats: 40,
    rating: 3.5,
    amenities: ["Water Bottle"],
    unavailableSeats: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
  },
  {
    id: "BUS007",
    operator: "Shyam Coaches",
    busType: "AC Sleeper",
    from: "Ahmedabad",
    to: "Rajkot",
    departure: "23:00",
    arrival: "04:30",
    duration: "5h 30m",
    fare: 620,
    totalSeats: 36,
    availableSeats: 15,
    rating: 4.6,
    amenities: ["AC", "WiFi", "Charging Point", "Blanket", "Pillow"],
    unavailableSeats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 16, 17, 18, 24, 25, 30, 31, 36, 11, 12, 19],
  },
  {
    id: "BUS008",
    operator: "Mahalaxmi Express",
    busType: "AC Seater",
    from: "Ahmedabad",
    to: "Rajkot",
    departure: "08:00",
    arrival: "13:30",
    duration: "5h 30m",
    fare: 420,
    totalSeats: 45,
    availableSeats: 22,
    rating: 4.1,
    amenities: ["AC", "Charging Point"],
    unavailableSeats: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45],
  },
  {
    id: "BUS009",
    operator: "Arrow Travels",
    busType: "Non-AC Seater",
    from: "Surat",
    to: "Ahmedabad",
    departure: "06:00",
    arrival: "10:30",
    duration: "4h 30m",
    fare: 270,
    totalSeats: 50,
    availableSeats: 35,
    rating: 3.7,
    amenities: ["Water Bottle"],
    unavailableSeats: [2, 6, 12, 18, 24, 30, 36, 42, 48, 4, 10, 16, 22, 28, 34],
  },
  {
    id: "BUS010",
    operator: "RapidBus",
    busType: "Volvo Multi-Axle",
    from: "Surat",
    to: "Ahmedabad",
    departure: "22:30",
    arrival: "03:00",
    duration: "4h 30m",
    fare: 530,
    totalSeats: 36,
    availableSeats: 20,
    rating: 4.8,
    amenities: ["AC", "WiFi", "Charging Point", "Blanket", "Pillow", "Entertainment"],
    unavailableSeats: [1, 2, 3, 4, 7, 8, 9, 10, 13, 14, 19, 20, 25, 26, 31, 32],
  },
  {
    id: "BUS011",
    operator: "Patel Express",
    busType: "AC Seater",
    from: "Baroda (Vadodara)",
    to: "Ahmedabad",
    departure: "07:00",
    arrival: "09:00",
    duration: "2h 00m",
    fare: 180,
    totalSeats: 40,
    availableSeats: 30,
    rating: 4.3,
    amenities: ["AC", "Charging Point", "Water Bottle"],
    unavailableSeats: [5, 10, 15, 20, 25, 30, 35, 40, 2, 8, 14],
  },
  {
    id: "BUS012",
    operator: "Neeta Travels",
    busType: "AC Sleeper",
    from: "Ahmedabad",
    to: "Baroda (Vadodara)",
    departure: "21:00",
    arrival: "23:15",
    duration: "2h 15m",
    fare: 300,
    totalSeats: 36,
    availableSeats: 14,
    rating: 4.4,
    amenities: ["AC", "WiFi", "Blanket", "Pillow"],
    unavailableSeats: [1, 2, 3, 4, 5, 6, 9, 10, 11, 12, 15, 16, 19, 20, 23, 24, 27, 28, 31, 32, 35, 36],
  },
  {
    id: "BUS013",
    operator: "SkyLine Travels",
    busType: "AC Semi-Sleeper",
    from: "Rajkot",
    to: "Ahmedabad",
    departure: "05:00",
    arrival: "10:30",
    duration: "5h 30m",
    fare: 400,
    totalSeats: 45,
    availableSeats: 25,
    rating: 4.0,
    amenities: ["AC", "Charging Point", "Water Bottle"],
    unavailableSeats: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40],
  },
  {
    id: "BUS014",
    operator: "Gujarat Travels",
    busType: "AC Seater",
    from: "Gandhinagar",
    to: "Surat",
    departure: "08:30",
    arrival: "13:00",
    duration: "4h 30m",
    fare: 430,
    totalSeats: 40,
    availableSeats: 16,
    rating: 4.2,
    amenities: ["AC", "Charging Point", "Water Bottle"],
    unavailableSeats: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 2, 4, 6, 8],
  },
  {
    id: "BUS015",
    operator: "Mahalaxmi Express",
    busType: "Non-AC Seater",
    from: "Anand",
    to: "Surat",
    departure: "06:30",
    arrival: "11:00",
    duration: "4h 30m",
    fare: 250,
    totalSeats: 50,
    availableSeats: 38,
    rating: 3.6,
    amenities: ["Water Bottle"],
    unavailableSeats: [5, 15, 25, 35, 45, 10, 20, 30, 40, 50, 3, 13],
  },
];

// Popular routes for homepage
const POPULAR_ROUTES = [
  { from: "Ahmedabad", to: "Surat", busCount: 8, startingFare: 280 },
  { from: "Anand", to: "Ahmedabad", busCount: 6, startingFare: 80 },
  { from: "Ahmedabad", to: "Rajkot", busCount: 5, startingFare: 420 },
  { from: "Baroda (Vadodara)", to: "Ahmedabad", busCount: 4, startingFare: 180 },
  { from: "Surat", to: "Ahmedabad", busCount: 7, startingFare: 270 },
  { from: "Gandhinagar", to: "Surat", busCount: 3, startingFare: 430 },
];

// Filter buses matching source and destination
function filterBuses(from, to) {
  if (!from || !to) return [];
  const fromCity = from.trim().toLowerCase();
  const toCity = to.trim().toLowerCase();
  return BUS_DATA.filter(function (bus) {
    return bus.from.toLowerCase() === fromCity && bus.to.toLowerCase() === toCity;
  });
}

// Find a bus by ID
function getBusById(busId) {
  return BUS_DATA.find(function (bus) {
    return bus.id === busId;
  }) || null;
}

// Sort buses by fare, rating, duration or departure
function sortBuses(buses, sortBy, direction) {
  if (!sortBy) sortBy = "departure";
  if (!direction) direction = "asc";

  const sorted = [...buses];
  sorted.sort(function (a, b) {
    let valA, valB;
    if (sortBy === "fare") {
      valA = a.fare;
      valB = b.fare;
    } else if (sortBy === "rating") {
      valA = a.rating;
      valB = b.rating;
    } else if (sortBy === "duration") {
      valA = parseDurationToMinutes(a.duration);
      valB = parseDurationToMinutes(b.duration);
    } else {
      valA = timeToMinutes(a.departure);
      valB = timeToMinutes(b.departure);
    }

    if (direction === "desc") {
      return valB - valA;
    }
    return valA - valB;
  });

  return sorted;
}

// Convert "HH:MM" to minutes for time sorting
function timeToMinutes(timeStr) {
  const parts = timeStr.split(":");
  return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

// Convert "4h 30m" to minutes
function parseDurationToMinutes(durationStr) {
  const hMatch = durationStr.match(/(\d+)h/);
  const mMatch = durationStr.match(/(\d+)m/);
  const hours = hMatch ? parseInt(hMatch[1]) : 0;
  const mins = mMatch ? parseInt(mMatch[1]) : 0;
  return hours * 60 + mins;
}

// Generate simple booking reference
function generateBookingRef() {
  const timestamp = Date.now().toString().slice(-6);
  const rand = Math.floor(Math.random() * 900 + 100);
  return "BR" + timestamp + rand;
}

// Format date for display
function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Today's date in YYYY-MM-DD
function getTodayString() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return yyyy + "-" + mm + "-" + dd;
}

// Future date in YYYY-MM-DD
function getFutureDateString(daysFromNow) {
  if (daysFromNow === undefined) daysFromNow = 7;
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return yyyy + "-" + mm + "-" + dd;
}
