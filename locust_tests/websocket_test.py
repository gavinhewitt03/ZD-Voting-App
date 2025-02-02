from locust import User, task
import websockets, asyncio, json

WS_URL = "ws://localhost:8001/ws/poll/locust/"

class WebSocketStandardsListener(User):
    async def listen(self):
        async with websockets.connect(WS_URL) as ws:
            print("Standards listening")
            while True:
                response = await ws.recv()
                print(response)
    
    @task
    def execute_listen(self):
        asyncio.run(self.listen())

class WebSocketPollSender(User):
    def __init__(self, environment):
        super().__init__(environment)
        self.loop = asyncio.new_event_loop()
        asyncio.set_event_loop(self.loop)
        self.user_id = self.environment.runner.user_count

    @task
    def execute_send(self):
        self.loop.run_until_complete(self.send_message())
        self.environment.runner.quit()

    async def send_message(self):
        print(f'{self.user_id} sending message')
        async with websockets.connect(WS_URL) as ws:
            message = json.dumps({"message": "test message", "name": self.user_id})
            await ws.send(message)
            print(f'{self.user_id} message sent')

from locust import User, task, events
import gevent
import websocket

class WebSocketUser(User):
    def on_start(self):
        """Establish WebSocket connection to Django Channels."""
        self.ws = websocket.WebSocket()
        self.ws.connect(WS_URL)
        self.user_id = self.environment.runner.user_count

    @task
    def send_message(self):
        """Send and receive messages over WebSocket."""
        self.ws.send(json.dump({"message": f"{self.user_id}", "name": self.user_id}))
        gevent.sleep(1)  # Simulate real user think-time

    def on_stop(self):
        """Close WebSocket connection."""
        self.ws.close()
