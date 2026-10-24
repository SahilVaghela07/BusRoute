// BusRoute - Authentication (Local Storage simulation)

var USERS_KEY = "busroute_users";
var CURRENT_USER_KEY = "busroute_current";

// Get all registered users from local storage
function getUsers() {
  var data = localStorage.getItem(USERS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

// Save users array to local storage
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Get current logged in user ID
function getCurrentUserId() {
  return localStorage.getItem(CURRENT_USER_KEY);
}

// Get current logged in user details
function getCurrentUser() {
  var id = getCurrentUserId();
  if (!id) return null;
  var users = getUsers();
  for (var i = 0; i < users.length; i++) {
    if (users[i].id === id) {
      return users[i];
    }
  }
  return null;
}

// Register a new user
function registerUser(name, email, phone, password) {
  var users = getUsers();

  // Check if email already registered
  for (var i = 0; i < users.length; i++) {
    if (users[i].email.toLowerCase() === email.trim().toLowerCase()) {
      return { success: false, error: "An account with this email already exists." };
    }
  }

  var newUser = {
    id: "user_" + Date.now(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    password: password,
    bookings: []
  };

  users.push(newUser);
  saveUsers(users);
  localStorage.setItem(CURRENT_USER_KEY, newUser.id);

  return { success: true, user: newUser };
}

// Login with email and password
function loginUser(email, password) {
  var users = getUsers();
  var cleanEmail = email.trim().toLowerCase();

  for (var i = 0; i < users.length; i++) {
    if (users[i].email.toLowerCase() === cleanEmail && users[i].password === password) {
      localStorage.setItem(CURRENT_USER_KEY, users[i].id);
      return { success: true, user: users[i] };
    }
  }

  return { success: false, error: "Invalid email or password. Please try again." };
}

// Logout user and redirect to login page
function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
  window.location.href = "/login.html";
}

// Save booking to current user account
function saveBookingToAccount(bookingData) {
  var userId = getCurrentUserId();
  if (!userId) return false;

  var users = getUsers();
  for (var i = 0; i < users.length; i++) {
    if (users[i].id === userId) {
      if (!users[i].bookings) {
        users[i].bookings = [];
      }
      users[i].bookings.unshift(bookingData);
      saveUsers(users);
      return true;
    }
  }
  return false;
}

// Check if user is logged in
function requireLogin() {
  if (!getCurrentUserId()) {
    window.location.href = "/login.html";
    return false;
  }
  return true;
}

// Update navbar with user info or login buttons
function initAuthNav() {
  var desktopSlot = document.getElementById("auth-nav-placeholder");
  var mobileSlot = document.getElementById("mobile-auth-nav");
  var user = getCurrentUser();

  if (user) {
    // User is logged in
    var initial = user.name.charAt(0).toUpperCase();
    var firstName = user.name.split(" ")[0];

    if (desktopSlot) {
      desktopSlot.innerHTML =
        '<div class="auth-user-menu" id="user-menu-toggle">' +
          '<div class="auth-avatar">' + initial + '</div>' +
          '<span class="auth-user-name">Hi, ' + firstName + '</span>' +
          '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>' +
          '<div class="auth-dropdown" id="auth-dropdown">' +
            '<a href="/my-bookings/" class="auth-dropdown-item">My Bookings</a>' +
            '<div class="auth-dropdown-divider"></div>' +
            '<button class="auth-dropdown-item auth-dropdown-logout" id="logout-btn" type="button">Logout</button>' +
          '</div>' +
        '</div>';

      var toggle = document.getElementById("user-menu-toggle");
      var dropdown = document.getElementById("auth-dropdown");

      toggle.addEventListener("click", function (e) {
        e.stopPropagation();
        dropdown.classList.toggle("open");
      });

      document.addEventListener("click", function () {
        dropdown.classList.remove("open");
      });

      document.getElementById("logout-btn").addEventListener("click", function (e) {
        e.stopPropagation();
        logoutUser();
      });
    }

    if (mobileSlot) {
      mobileSlot.innerHTML =
        '<div class="mobile-auth-info">' +
          '<div class="mobile-auth-avatar">' + initial + '</div>' +
          '<div>' +
            '<div class="mobile-auth-name">' + user.name + '</div>' +
            '<div class="mobile-auth-email">' + user.email + '</div>' +
          '</div>' +
        '</div>' +
        '<a href="/my-bookings/" class="mobile-auth-link">My Bookings</a>' +
        '<button type="button" id="mobile-logout-btn" class="btn btn-outline mobile-auth-logout">Logout</button>';

      document.getElementById("mobile-logout-btn").addEventListener("click", logoutUser);
    }
  } else {
    // User is logged out
    if (desktopSlot) {
      desktopSlot.innerHTML =
        '<a href="/login/" class="nav-auth-link">Login</a>' +
        '<a href="/register/" class="btn btn-primary btn-sm">Register</a>';
    }
    if (mobileSlot) {
      mobileSlot.innerHTML =
        '<a href="/login/" class="mobile-auth-link">Login</a>' +
        '<a href="/register/" class="btn btn-primary" style="margin-top:0.5rem;">Register Free</a>';
    }
  }
}
