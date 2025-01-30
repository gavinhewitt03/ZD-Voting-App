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
    def on_start(self):
        self.user_id = self.environment.runner.user_count
    
    async def send_message(self):
        print(f'{self.user_id} sending message')
        async with websockets.connect(WS_URL) as ws:
            message = json.dumps({"message": "test message", "name": self.user_id})
            await ws.send(message)
            print(f'{self.user_id} message sent')

    @task
    def execute_send_message(self):
        asyncio.run(self.send_message())
        self.environment.runner.quit()
