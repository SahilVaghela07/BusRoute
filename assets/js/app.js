// BusRoute - Main Application Script

// HTML escape helper to prevent XSS
function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Mobile menu navigation toggle
function initNavigation() {
  var hamburger = document.getElementById("hamburger-btn");
  var mobileMenu = document.getElementById("mobile-menu");
  var mobileOverlay = document.getElementById("mobile-overlay");

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener("click", function () {
    var isOpen = mobileMenu.classList.toggle("open");
    if (mobileOverlay) mobileOverlay.classList.toggle("active", isOpen);
  });

  if (mobileOverlay) {
    mobileOverlay.addEventListener("click", function () {
      mobileMenu.classList.remove("open");
      mobileOverlay.classList.remove("active");
    });
  }
}

// Populate city dropdowns
function populateCityDropdowns(selectIds) {
  selectIds.forEach(function (id) {
    var select = document.getElementById(id);
    if (!select) return;

    // Keep first default option
    var defaultOpt = select.options[0] ? select.options[0].text : "Select city";
    select.innerHTML = '<option value="">' + defaultOpt + '</option>';

    CITIES.forEach(function (city) {
      var opt = document.createElement("option");
      opt.value = city;
      opt.textContent = city;
      select.appendChild(opt);
    });
  });
}

// Set minimum date to today for date pickers
function setMinDates(inputIds) {
  var today = getTodayString();
  inputIds.forEach(function (id) {
    var input = document.getElementById(id);
    if (input) {
      input.min = today;
      if (!input.value) {
        input.value = getFutureDateString(1);
      }
    }
  });
}

// Show field error message
function showFieldError(fieldId, message) {
  var field = document.getElementById(fieldId);
  if (!field) return;

  field.classList.add("input-error");
  var errorEl = document.getElementById(fieldId + "-error");
  if (!errorEl) {
    errorEl = document.createElement("span");
    errorEl.id = fieldId + "-error";
    errorEl.className = "field-error-msg";
    field.parentNode.appendChild(errorEl);
  }
  errorEl.textContent = message;
}

// Clear field error message
function clearFieldError(fieldId) {
  var field = document.getElementById(fieldId);
  if (field) field.classList.remove("input-error");
  var errorEl = document.getElementById(fieldId + "-error");
  if (errorEl) errorEl.textContent = "";
}

// 1. Home Page Functions

function initHomePage() {
  populateCityDropdowns(["search-from", "search-to"]);
  setMinDates(["search-date"]);

  // Swap button logic
  var swapBtn = document.getElementById("swap-btn");
  if (swapBtn) {
    swapBtn.addEventListener("click", function () {
      var from = document.getElementById("search-from");
      var to = document.getElementById("search-to");
      if (from && to) {
        var temp = from.value;
        from.value = to.value;
        to.value = temp;
      }
    });
  }

  // Search form submit validation
  var form = document.getElementById("hero-search-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      var from = document.getElementById("search-from").value.trim();
      var to = document.getElementById("search-to").value.trim();
      var date = document.getElementById("search-date").value;
      var pass = document.getElementById("search-passengers").value;
      var hasError = false;

      if (!from) {
        showFieldError("search-from", "Please select departure city.");
        hasError = true;
      } else {
        clearFieldError("search-from");
      }

      if (!to) {
        showFieldError("search-to", "Please select destination city.");
        hasError = true;
      } else if (from && from === to) {
        showFieldError("search-to", "Source and destination cannot be the same.");
        hasError = true;
      } else {
        clearFieldError("search-to");
      }

      if (!date) {
        showFieldError("search-date", "Please select travel date.");
        hasError = true;
      } else if (date < getTodayString()) {
        showFieldError("search-date", "Travel date cannot be in the past.");
        hasError = true;
      } else {
        clearFieldError("search-date");
      }

      if (!pass || parseInt(pass) < 1 || parseInt(pass) > 6) {
        showFieldError("search-passengers", "Passengers must be between 1 and 6.");
        hasError = true;
      } else {
        clearFieldError("search-passengers");
      }

      if (hasError) {
        e.preventDefault();
      }
    });
  }

  renderPopularRoutes();
}

// Render popular routes cards
function renderPopularRoutes() {
  var grid = document.getElementById("popular-routes-grid");
  if (!grid) return;

  grid.innerHTML = "";
  POPULAR_ROUTES.forEach(function (route) {
    var card = document.createElement("a");
    card.className = "route-card";
    card.href = "/buses/?from=" + encodeURIComponent(route.from) +
                "&to=" + encodeURIComponent(route.to) +
                "&date=" + getFutureDateString(1) +
                "&passengers=1";

    card.innerHTML =
      '<div class="route-cities">' +
        '<span class="route-city">' + route.from + '</span>' +
        '<span class="route-arrow">→</span>' +
        '<span class="route-city">' + route.to + '</span>' +
      '</div>' +
      '<div class="route-meta">' +
        '<span>' + route.busCount + ' buses daily</span>' +
        '<span class="route-fare">From ₹' + route.startingFare + '</span>' +
      '</div>';

    grid.appendChild(card);
  });
}

// 2. Bus Results Page Functions

function initBusesPage() {
  var params = new URLSearchParams(window.location.search);
  var from = params.get("from") || "";
  var to = params.get("to") || "";
  var date = params.get("date") || getTodayString();
  var passengers = parseInt(params.get("passengers")) || 1;

  // Show summary
  var summaryEl = document.getElementById("search-summary");
  if (summaryEl) {
    if (from && to) {
      summaryEl.textContent = from + " → " + to + " | " + formatDate(date) + " | " + passengers + (passengers > 1 ? " Passengers" : " Passenger");
    } else {
      summaryEl.textContent = "Showing all available buses";
    }
  }

  // Filter matching buses — check real Django database data first
  var buses = [];
  var djangoDataEl = document.getElementById("django-buses-data");
  var hasDjangoData = false;

  if (djangoDataEl && djangoDataEl.textContent.trim()) {
    try {
      var parsed = JSON.parse(djangoDataEl.textContent);
      if (Array.isArray(parsed)) {
        buses = parsed;
        hasDjangoData = true;
      }
    } catch (e) {
      console.error("Error loading database buses:", e);
    }
  }

  if (!hasDjangoData) {
    if (from && to) {
      buses = filterBuses(from, to);
    }
    if (buses.length === 0 && !from && !to) {
      buses = BUS_DATA.slice(0, 6);
    }
  }

  var countEl = document.getElementById("results-count");
  if (countEl) {
    if (buses.length === 0) {
      countEl.textContent = "0 buses found";
    } else {
      countEl.textContent = buses.length + (buses.length === 1 ? " bus found" : " buses found");
    }
  }

  renderBusList(buses, date, passengers);

  // Sorting
  var sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      var val = sortSelect.value;
      var parts = val.split("-");
      var sorted = sortBuses(buses, parts[0], parts[1]);
      renderBusList(sorted, date, passengers);
    });
  }
}

// Render bus cards into list
function renderBusList(buses, date, passengers) {
  var container = document.getElementById("buses-list") || document.getElementById("bus-results-container");
  if (!container) return;

  container.innerHTML = "";

  if (buses.length === 0) {
    container.innerHTML =
      '<div class="empty-state">' +
        '<h3>No buses available</h3>' +
        '<p>Please try searching for another route or date.</p>' +
        '<a href="/" class="btn btn-primary" style="margin-top:1rem;">Search Again</a>' +
      '</div>';
    return;
  }

  buses.forEach(function (bus) {
    var card = document.createElement("div");
    card.className = "bus-card";

    var bookingUrl = "/booking.html?busId=" + encodeURIComponent(bus.id) +
                     "&date=" + encodeURIComponent(date) +
                     "&passengers=" + encodeURIComponent(passengers);

    card.innerHTML =
      '<div class="bus-card-header">' +
        '<div>' +
          '<h3 class="bus-operator-name" style="margin: 0 0 0.35rem 0; font-size: 1.25rem; font-weight: 700; color: var(--color-primary);">' + escapeHtml(bus.operator) + '</h3>' +
          '<span class="bus-type-badge">' + escapeHtml(bus.busType) + '</span>' +
        '</div>' +
        '<div style="text-align: right;">' +
          '<div style="font-size: 1.4rem; font-weight: 800; color: var(--color-primary);">₹' + bus.fare + '</div>' +
          '<div style="font-size: 0.8rem; color: var(--color-muted);">per seat</div>' +
        '</div>' +
      '</div>' +

      '<div class="bus-details-grid">' +
        '<div class="bus-detail-row">' +
          '<span class="detail-label">Route</span>' +
          '<span class="detail-value">' + escapeHtml(bus.from) + ' → ' + escapeHtml(bus.to) + '</span>' +
        '</div>' +
        '<div class="bus-detail-row">' +
          '<span class="detail-label">Departure</span>' +
          '<span class="detail-value">' + escapeHtml(bus.departure) + ' (' + escapeHtml(bus.from) + ')</span>' +
        '</div>' +
        '<div class="bus-detail-row">' +
          '<span class="detail-label">Arrival</span>' +
          '<span class="detail-value">' + escapeHtml(bus.arrival) + ' (' + escapeHtml(bus.to) + ')</span>' +
        '</div>' +
        '<div class="bus-detail-row">' +
          '<span class="detail-label">Duration</span>' +
          '<span class="detail-value">' + escapeHtml(bus.duration) + '</span>' +
        '</div>' +
        '<div class="bus-detail-row">' +
          '<span class="detail-label">Rating</span>' +
          '<span class="detail-value">★ ' + bus.rating + ' / 5</span>' +
        '</div>' +
        '<div class="bus-detail-row">' +
          '<span class="detail-label">Available Seats</span>' +
          '<span class="detail-value">' + bus.availableSeats + ' seats left</span>' +
        '</div>' +
      '</div>' +

      '<div class="bus-card-footer" style="display: flex; justify-content: flex-end; align-items: center; padding-top: 1rem; border-top: 1px solid var(--color-border);">' +
        '<a href="' + bookingUrl + '" class="btn btn-primary">Select Seats</a>' +
      '</div>';

    container.appendChild(card);
  });
}

// 3. Booking Page Functions

var currentBusFare = 0;
var selectedSeats = [];

function initBookingPage() {
  var params = new URLSearchParams(window.location.search);
  var busId = params.get("busId") || "BUS001";
  var date = params.get("date") || getTodayString();
  var passengers = parseInt(params.get("passengers")) || 1;

  var bus = null;
  var djangoBusEl = document.getElementById("django-bus-data");
  if (djangoBusEl && djangoBusEl.textContent.trim()) {
    try {
      var parsed = JSON.parse(djangoBusEl.textContent);
      if (parsed && parsed.id) {
        bus = parsed;
      }
    } catch (e) {}
  }
  if (!bus) {
    bus = getBusById(busId) || BUS_DATA[0];
  }
  currentBusFare = bus.fare;
  selectedSeats = [];

  renderBusSummary(bus, date, passengers);
  renderSeatMap(bus, passengers);
  initBookingForm(bus, date, passengers);
}

// Render selected bus summary card
function renderBusSummary(bus, date, passengers) {
  var container = document.getElementById("bus-summary-card");
  if (!container) return;

  container.innerHTML =
    '<div class="bus-summary-box">' +
      '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">' +
        '<div>' +
          '<h3 style="font-size:1.15rem; font-weight:700; color:var(--color-primary);">' + bus.operator + '</h3>' +
          '<span class="bus-type-badge">' + bus.busType + '</span>' +
        '</div>' +
        '<div style="text-align:right;">' +
          '<span style="font-size:1.25rem; font-weight:800; color:var(--color-primary);">₹' + bus.fare + '</span>' +
          '<div style="font-size:0.8rem; color:var(--color-muted);">per seat</div>' +
        '</div>' +
      '</div>' +
      '<div class="confirm-row" style="padding:0.4rem 0;">' +
        '<span style="color:var(--color-muted);">Route:</span>' +
        '<strong>' + bus.from + ' → ' + bus.to + '</strong>' +
      '</div>' +
      '<div class="confirm-row" style="padding:0.4rem 0;">' +
        '<span style="color:var(--color-muted);">Travel Date:</span>' +
        '<strong>' + formatDate(date) + '</strong>' +
      '</div>' +
      '<div class="confirm-row" style="padding:0.4rem 0;">' +
        '<span style="color:var(--color-muted);">Departure:</span>' +
        '<strong>' + bus.departure + ' (' + bus.duration + ' trip)</strong>' +
      '</div>' +
    '</div>';

  var farePerSeatEl = document.getElementById("fare-per-seat");
  if (farePerSeatEl) farePerSeatEl.textContent = "₹" + bus.fare;
}

// Interactive Seat Selection Map
function renderSeatMap(bus, maxPassengers) {
  var mapEl = document.getElementById("seat-map");
  if (!mapEl) return;

  var total = bus.totalSeats || 40;
  var unavailable = bus.unavailableSeats || [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38];

  mapEl.innerHTML =
    '<div class="bus-seat-legend">' +
      '<div class="legend-badge"><span class="legend-box available-box"></span> Available</div>' +
      '<div class="legend-badge"><span class="legend-box selected-box"></span> Selected</div>' +
      '<div class="legend-badge"><span class="legend-box booked-box"></span> Booked</div>' +
    '</div>' +

    '<div class="bus-cabin-container">' +
      '<div class="bus-cabin-front">' +
        '<span class="bus-front-label">FRONT</span>' +
        '<div class="bus-steering-wheel" title="Driver Cabin">' +
          '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="9"/><line x1="2" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="22" y2="12"/><line x1="12" y1="15" x2="12" y2="22"/></svg>' +
          '<span>Driver</span>' +
        '</div>' +
      '</div>' +

      '<div class="bus-seats-deck" id="bus-seats-deck"></div>' +

      '<div class="bus-cabin-back">' +
        '<span>BACK</span>' +
      '</div>' +
    '</div>' +

    '<div class="seat-selection-summary">' +
      '<div>' +
        '<span style="font-size: 0.85rem; color: var(--color-muted); display: block;">Selected Seat(s):</span>' +
        '<strong id="selected-seats-display" style="font-size: 1.05rem; color: var(--color-primary);">None</strong>' +
      '</div>' +
      '<div style="text-align: right;">' +
        '<span style="font-size: 0.85rem; color: var(--color-muted); display: block;">Total Fare:</span>' +
        '<strong id="fare-total" style="font-size: 1.25rem; color: var(--color-primary);">₹0</strong>' +
      '</div>' +
    '</div>';

  var deckEl = document.getElementById("bus-seats-deck");
  if (!deckEl) return;

  var seatNum = 1;
  while (seatNum <= total) {
    // Left Window Seat
    createSeatElement(deckEl, seatNum++, unavailable, maxPassengers);

    // Left Aisle Seat
    if (seatNum <= total) {
      createSeatElement(deckEl, seatNum++, unavailable, maxPassengers);
    }

    // Aisle Walkway Spacer
    var aisle = document.createElement("div");
    aisle.className = "bus-aisle-spacer";
    deckEl.appendChild(aisle);

    // Right Aisle Seat
    if (seatNum <= total) {
      createSeatElement(deckEl, seatNum++, unavailable, maxPassengers);
    }

    // Right Window Seat
    if (seatNum <= total) {
      createSeatElement(deckEl, seatNum++, unavailable, maxPassengers);
    }
  }
}

// Helper to create a single seat button
function createSeatElement(parent, num, unavailable, maxPassengers) {
  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "bus-seat";
  btn.textContent = num;
  btn.dataset.seat = num;

  if (unavailable.indexOf(num) !== -1) {
    btn.classList.add("seat-booked");
    btn.disabled = true;
    btn.title = "Seat " + num + " is already booked";
  } else {
    btn.classList.add("seat-available");
    btn.title = "Select Seat " + num;
    btn.addEventListener("click", function () {
      handleSeatClick(this, maxPassengers);
    });
  }

  parent.appendChild(btn);
}

// Handle clicking on a seat
function handleSeatClick(btn, maxPassengers) {
  var seatNum = parseInt(btn.dataset.seat);
  var index = selectedSeats.indexOf(seatNum);
  var msgEl = document.getElementById("seat-message") || document.getElementById("seat-selection-message");

  if (index !== -1) {
    // Deselect
    selectedSeats.splice(index, 1);
    btn.classList.remove("seat-selected");
    btn.classList.add("seat-available");
    if (msgEl) {
      msgEl.textContent = "";
      msgEl.hidden = true;
    }
  } else {
    // Select seat
    if (selectedSeats.length >= maxPassengers) {
      if (msgEl) {
        msgEl.className = "seat-message seat-message-error";
        msgEl.textContent = "You chose " + maxPassengers + " passenger(s). Deselect a seat first to pick another.";
        msgEl.hidden = false;
      }
      return;
    }
    selectedSeats.push(seatNum);
    btn.classList.remove("seat-available");
    btn.classList.add("seat-selected");
    if (msgEl) {
      msgEl.textContent = "";
      msgEl.hidden = true;
    }
  }

  updateSeatSummary();
}

// Update selected seats text and fare total
function updateSeatSummary() {
  selectedSeats.sort(function (a, b) { return a - b; });

  var seatsText = selectedSeats.length > 0 ? selectedSeats.map(function(s) { return "Seat " + s; }).join(", ") : "None";

  var seatsDisplay = document.getElementById("selected-seats-display");
  if (seatsDisplay) {
    seatsDisplay.textContent = seatsText;
  }

  var countDisplay = document.getElementById("selected-seats-count");
  if (countDisplay) {
    countDisplay.textContent = selectedSeats.length;
  }

  var total = selectedSeats.length * currentBusFare;
  var totalFareEl = document.getElementById("fare-total");
  if (totalFareEl) {
    totalFareEl.textContent = "₹" + total;
  }

  // Update hidden input in booking form
  var hiddenInput = document.getElementById("selected-seats-input");
  if (hiddenInput) {
    hiddenInput.value = selectedSeats.join(", ");
  }

  // Update right sidebar fare summary display
  var fareDisplayEl = document.getElementById("fare-display");
  if (fareDisplayEl) {
    if (selectedSeats.length > 0) {
      fareDisplayEl.innerHTML =
        '<div style="font-size: 1.85rem; font-weight: 800; color: var(--color-primary); margin-bottom: 0.25rem;">₹' + total + '</div>' +
        '<div style="font-size: 0.85rem; color: var(--color-muted);">' + selectedSeats.length + ' seat(s): ' + seatsText + '</div>';
    } else {
      fareDisplayEl.textContent = "Select seats to calculate fare";
    }
  }
}

// Booking form submission (Simulated POST)
function initBookingForm(bus, date, passengers) {
  var form = document.getElementById("booking-form");
  if (!form) return;

  // Auto-fill logged-in user details if available
  var user = getCurrentUser();
  if (user) {
    var nameInput = document.getElementById("passenger-name");
    var emailInput = document.getElementById("passenger-email");
    var phoneInput = document.getElementById("passenger-phone");
    if (nameInput && !nameInput.value) nameInput.value = user.name;
    if (emailInput && !emailInput.value) emailInput.value = user.email;
    if (phoneInput && !phoneInput.value && user.phone) phoneInput.value = user.phone;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var name = document.getElementById("passenger-name").value.trim();
    var email = document.getElementById("passenger-email").value.trim();
    var phone = document.getElementById("passenger-phone").value.trim();
    var hasError = false;

    if (!name || name.length < 2) {
      showFieldError("passenger-name", "Please enter full name.");
      hasError = true;
    } else {
      clearFieldError("passenger-name");
    }

    if (!email || email.indexOf("@") === -1) {
      showFieldError("passenger-email", "Please enter a valid email address.");
      hasError = true;
    } else {
      clearFieldError("passenger-email");
    }

    if (!phone || phone.length < 10) {
      showFieldError("passenger-phone", "Please enter a valid 10-digit mobile number.");
      hasError = true;
    } else {
      clearFieldError("passenger-phone");
    }

    if (selectedSeats.length === 0) {
      var msgEl = document.getElementById("seat-selection-message");
      if (msgEl) msgEl.textContent = "Please select at least one seat on the seat map.";
      hasError = true;
    }

    if (hasError) return;

    var bookingData = {
      bookingRef: generateBookingRef(),
      busId: bus.id,
      operator: bus.operator,
      busType: bus.busType,
      from: bus.from,
      to: bus.to,
      departure: bus.departure,
      arrival: bus.arrival,
      duration: bus.duration,
      date: date,
      passengers: selectedSeats.length,
      selectedSeats: selectedSeats,
      farePerSeat: currentBusFare,
      totalFare: currentBusFare * selectedSeats.length,
      passengerName: name,
      passengerEmail: email,
      passengerPhone: phone,
      bookingTime: new Date().toLocaleString()
    };

    // Store in sessionStorage for confirmation page
    sessionStorage.setItem("busroute_booking", JSON.stringify(bookingData));

    // Also save in user account in localStorage
    saveBookingToAccount(bookingData);

    // Redirect to confirmation page
    window.location.href = "/confirmation.html";
  });
}

// 4. Confirmation Page Functions

function initConfirmationPage() {
  var raw = sessionStorage.getItem("busroute_booking");
  var card = document.getElementById("confirmation-card");
  if (!card) return;

  if (!raw) {
    card.innerHTML =
      '<div class="empty-state">' +
        '<h2>No booking details found</h2>' +
        '<p>You might have refreshed or opened this page directly.</p>' +
        '<a href="/" class="btn btn-primary" style="margin-top:1rem;">Back to Home</a>' +
      '</div>';
    return;
  }

  var booking = JSON.parse(raw);
  var seatsText = Array.isArray(booking.selectedSeats) ? booking.selectedSeats.join(", ") : booking.selectedSeats;

  card.innerHTML =
    '<div class="confirm-success-icon">' +
      '<svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="2">' +
        '<circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>' +
      '</svg>' +
    '</div>' +
    '<h2 class="confirm-heading">Booking Confirmed!</h2>' +
    '<p class="confirm-subtitle">Your bus reservation has been simulated successfully.</p>' +

    '<div class="confirm-ref-box">' +
      '<span class="confirm-ref-label">Booking Reference Number</span>' +
      '<span class="confirm-ref-number">' + escapeHtml(booking.bookingRef) + '</span>' +
    '</div>' +

    '<div class="confirm-details-grid">' +
      '<div class="confirm-row"><span class="confirm-label">Passenger Name:</span><strong>' + escapeHtml(booking.passengerName) + '</strong></div>' +
      '<div class="confirm-row"><span class="confirm-label">Email:</span><span>' + escapeHtml(booking.passengerEmail) + '</span></div>' +
      '<div class="confirm-row"><span class="confirm-label">Phone:</span><span>' + escapeHtml(booking.passengerPhone) + '</span></div>' +
      '<div class="confirm-row"><span class="confirm-label">Bus Operator:</span><strong>' + escapeHtml(booking.operator) + ' (' + escapeHtml(booking.busType) + ')</strong></div>' +
      '<div class="confirm-row"><span class="confirm-label">Route:</span><strong>' + escapeHtml(booking.from) + ' → ' + escapeHtml(booking.to) + '</strong></div>' +
      '<div class="confirm-row"><span class="confirm-label">Date:</span><span>' + formatDate(booking.date) + '</span></div>' +
      '<div class="confirm-row"><span class="confirm-label">Time:</span><span>Departure ' + escapeHtml(booking.departure) + ' (Arrival ' + escapeHtml(booking.arrival) + ')</span></div>' +
      '<div class="confirm-row"><span class="confirm-label">Seat(s):</span><strong>' + escapeHtml(seatsText) + '</strong></div>' +
      '<div class="confirm-row confirm-row-total"><span class="confirm-label">Total Amount Paid:</span><strong class="confirm-total-fare">₹' + booking.totalFare + '</strong></div>' +
    '</div>' +

    '<div class="confirm-actions" style="margin-top:2rem; display:flex; gap:1rem; justify-content:center;">' +
      '<a href="/" class="btn btn-primary">Book Another Bus</a>' +
      '<a href="/my-bookings/" class="btn btn-outline">View My Bookings</a>' +
    '</div>';
}

// 5. Login and Register Functions

function initLoginPage() {
  var form = document.getElementById("login-form");
  var alertEl = document.getElementById("login-alert");
  var pwToggle = document.getElementById("login-pw-toggle");
  var pwInput = document.getElementById("login-password");

  if (pwToggle && pwInput) {
    pwToggle.addEventListener("click", function () {
      pwInput.type = pwInput.type === "password" ? "text" : "password";
    });
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = document.getElementById("login-email").value.trim();
      var password = document.getElementById("login-password").value;

      if (!email || !password) {
        showAlert(alertEl, "Please enter both email and password.");
        return;
      }

      var res = loginUser(email, password);
      if (res.success) {
        window.location.href = "/";
      } else {
        showAlert(alertEl, res.error);
      }
    });
  }
}

function initRegisterPage() {
  var form = document.getElementById("register-form");
  var alertEl = document.getElementById("register-alert");
  var pwToggle = document.getElementById("reg-pw-toggle");
  var pwInput = document.getElementById("reg-password");
  var cpwToggle = document.getElementById("reg-cpw-toggle");
  var cpwInput = document.getElementById("reg-confirm-password");

  if (pwToggle && pwInput) {
    pwToggle.addEventListener("click", function () {
      pwInput.type = pwInput.type === "password" ? "text" : "password";
    });
  }
  if (cpwToggle && cpwInput) {
    cpwToggle.addEventListener("click", function () {
      cpwInput.type = cpwInput.type === "password" ? "text" : "password";
    });
  }

  // Password strength meter
  if (pwInput) {
    pwInput.addEventListener("input", function () {
      var val = pwInput.value;
      var area = document.getElementById("password-strength-area");
      var fill = document.getElementById("strength-fill");
      var label = document.getElementById("password-strength-label");

      if (!area || !fill || !label) return;

      if (!val) {
        area.hidden = true;
        return;
      }
      area.hidden = false;

      if (val.length < 6) {
        fill.className = "password-strength-fill strength-weak";
        label.textContent = "Weak (minimum 6 characters required)";
      } else if (val.length < 10) {
        fill.className = "password-strength-fill strength-medium";
        label.textContent = "Medium password";
      } else {
        fill.className = "password-strength-fill strength-strong";
        label.textContent = "Strong password!";
      }
    });
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("reg-name").value.trim();
      var email = document.getElementById("reg-email").value.trim();
      var phone = document.getElementById("reg-phone").value.trim();
      var password = document.getElementById("reg-password").value;
      var confirm = document.getElementById("reg-confirm-password").value;

      if (!name || name.length < 2) {
        showAlert(alertEl, "Please enter your full name.");
        return;
      }
      if (!email || email.indexOf("@") === -1) {
        showAlert(alertEl, "Please enter a valid email address.");
        return;
      }
      if (!phone || phone.length < 10) {
        showAlert(alertEl, "Please enter a valid 10-digit mobile number.");
        return;
      }
      if (password.length < 6) {
        showAlert(alertEl, "Password must be at least 6 characters.");
        return;
      }
      if (password !== confirm) {
        showAlert(alertEl, "Passwords do not match.");
        return;
      }

      var res = registerUser(name, email, phone, password);
      if (res.success) {
        window.location.href = "/";
      } else {
        showAlert(alertEl, res.error);
      }
    });
  }
}

function showAlert(el, msg) {
  if (!el) return;
  el.className = "auth-alert auth-alert-error";
  el.textContent = msg;
  el.removeAttribute("hidden");
}

// 7. My Bookings Functions

function initMyBookingsPage() {
  requireLogin();

  var user = getCurrentUser();
  if (!user) return;

  var listEl = document.getElementById("bookings-list");
  if (!listEl) return;

  var bookings = user.bookings || [];

  if (bookings.length === 0) {
    listEl.innerHTML =
      '<div class="empty-state">' +
        '<h3>No bookings found</h3>' +
        '<p>You have not made any bus bookings yet.</p>' +
        '<a href="/" class="btn btn-primary" style="margin-top:1rem;">Search Buses</a>' +
      '</div>';
    return;
  }

  listEl.innerHTML = "";
  bookings.forEach(function (b) {
    var card = document.createElement("div");
    card.className = "booking-history-card";

    var seatsText = Array.isArray(b.selectedSeats) ? b.selectedSeats.join(", ") : b.selectedSeats;

    card.innerHTML =
      '<div class="booking-history-header">' +
        '<span class="booking-ref-tag">Ref: ' + escapeHtml(b.bookingRef) + '</span>' +
        '<span class="booking-status-badge">Confirmed</span>' +
      '</div>' +
      '<div class="booking-history-route">' +
        '<span class="booking-history-city">' + escapeHtml(b.from) + '</span>' +
        '<span class="booking-history-arrow">→</span>' +
        '<span class="booking-history-city">' + escapeHtml(b.to) + '</span>' +
      '</div>' +
      '<div class="booking-history-meta">' +
        '<div class="booking-meta-item"><span class="booking-meta-label">Operator:</span><span class="booking-meta-value">' + escapeHtml(b.operator) + '</span></div>' +
        '<div class="booking-meta-item"><span class="booking-meta-label">Date:</span><span class="booking-meta-value">' + formatDate(b.date) + '</span></div>' +
        '<div class="booking-meta-item"><span class="booking-meta-label">Time:</span><span class="booking-meta-value">' + escapeHtml(b.departure) + '</span></div>' +
        '<div class="booking-meta-item"><span class="booking-meta-label">Seats:</span><span class="booking-meta-value">' + escapeHtml(seatsText) + '</span></div>' +
        '<div class="booking-meta-item"><span class="booking-meta-label">Total Fare:</span><span class="booking-meta-value fare">₹' + b.totalFare + '</span></div>' +
      '</div>';

    listEl.appendChild(card);
  });
}

// 8. Page Routing on Load

document.addEventListener("DOMContentLoaded", function () {
  initNavigation();
  initAuthNav();

  var page = document.body.dataset.page;
  if (page === "home") {
    initHomePage();
  } else if (page === "buses") {
    initBusesPage();
  } else if (page === "booking") {
    initBookingPage();
  } else if (page === "confirmation") {
    initConfirmationPage();

  } else if (page === "login") {
    initLoginPage();
  } else if (page === "register") {
    initRegisterPage();
  } else if (page === "my-bookings") {
    initMyBookingsPage();
  }
});
