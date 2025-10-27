from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/rfid/status/$", consumers.RFIDConsumer.as_asgi()),
]
