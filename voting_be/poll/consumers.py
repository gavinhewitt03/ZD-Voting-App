import json

from channels.generic.websocket import AsyncWebsocketConsumer


class PollConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"poll_{self.room_name}"
        self.message_queue = []

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

        if len(self.message_queue) != 0:
            await self.send(text_data=json.dumps({
                "type": "poll.message",
                "message": self.message_queue[-1],
                "name": "history"
            }))

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        name = text_data_json["name"]

        if isinstance(message, dict) and message['rushee_name'] == '':
            self.message_queue.clear()
        elif isinstance(message, dict):
            self.message_queue.append(message)


        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name, 
            {
                "type": "poll.message", 
                "message": message, 
                "name": name
            }
        )

    # Receive message from room group
    async def poll_message(self, event):
        message = event["message"]
        name = event["name"]
 
        # Send message to WebSocket
        await self.send(text_data=json.dumps(
            {
                "message": message, 
                "name": name
            }
        ))