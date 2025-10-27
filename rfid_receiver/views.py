from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import RFIDLog
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.shortcuts import render


@api_view(["POST"])
def rfid_data(request):
    tag_id = request.data.get("tag_id")
    name = request.data.get("name")
    time = request.data.get("time")
    print("Received RFID:", tag_id)
    print("Client Name:", name)
    if not tag_id:
        return Response({"error": "No tag_id"}, status=400)

    RFIDLog.objects.create(name=name, tag_id=tag_id)

    # notify WebSocket group
    layer = get_channel_layer()
    async_to_sync(layer.group_send)(
        "rfid_updates",
        {
            "type": "rfid.message",
            "name": f"{name}",
            "tag_id": tag_id,
            "time": time,
        },
    )

    return Response({"status": "saved"}, status=201)


def monitor_page(request):
    return render(request, "rfid_app/monitor.html")
