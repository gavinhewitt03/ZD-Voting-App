from django.test import TestCase
from channels.testing import WebsocketCommunicator
from .consumers import PollConsumer

# Create your tests here.
class StandardsTest(TestCase):
    async def test_receive(self):
        communicator = WebsocketCommunicator(PollConsumer.as_asgi(), "/ws/poll/testing/")
        connected, subprotocol = communicator.connect()
        assert connected

        while True:
            message = await communicator.receive_json_from()
            print(message)
