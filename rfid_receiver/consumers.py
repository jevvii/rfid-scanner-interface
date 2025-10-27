import json
from channels.generic.websocket import AsyncWebsocketConsumer


class RFIDConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("rfid_updates", self.channel_name)
        await self.accept()

    async def disconnet(self, close_code):
        await self.channel_layer.group_discard("rfid_updates", self.channel_name)

    async def rfid_message(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "message": event["name"],
                    "tag_id": event["tag_id"],
                    "time": event["time"],
                }
            )
        )
