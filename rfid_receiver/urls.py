from django.urls import path
from . import views

urlpatterns = [
    path("api/rfid-data/", views.rfid_data, name="rfid_data"),
]
