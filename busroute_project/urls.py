from django.contrib import admin
from django.urls import path, re_path
from django.views.static import serve
from django.conf import settings
from reservations import views

urlpatterns = [
    path('admin/', admin.site.urls),

    # Home
    path('', views.home_view, name='home'),
    path('index.html', views.home_view),
    path('buses/index.html', views.home_view),

    # Buses Search
    path('buses/', views.buses_view, name='buses'),
    path('buses.html', views.buses_view),

    # Booking Form
    path('booking/<int:bus_id>/', views.booking_view, name='booking'),
    path('booking.html', views.booking_view),

    # Confirmation
    path('confirmation/<int:booking_id>/', views.confirmation_view, name='confirmation'),
    path('confirmation.html', views.confirmation_view),

    # Login
    path('login/', views.login_view, name='login'),
    path('login.html', views.login_view),

    # Register
    path('register/', views.register_view, name='register'),
    path('register.html', views.register_view),

    # My Bookings
    path('my-bookings/', views.my_bookings_view, name='my_bookings'),
    path('my-bookings.html', views.my_bookings_view),


    # Serve CSS and JS assets (handles /assets/ and /buses/assets/ etc)
    re_path(r'^(?:.*/)?assets/(?P<path>.*)$', serve, {'document_root': settings.BASE_DIR / 'assets'}),
]
