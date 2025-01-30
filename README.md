# ZD-Voting-App
A React/Django voting web application created for the Zeta Delta chapter of Theta Tau.

In one terminal I've been running:
locust -f websocket_test.py --headless -u 1 -r 1 --class WebSocketStandardsListener

In another:
locust -f websocket_test.py --headless -u 100 -r 10 --class WebSocketPollSender

Having some issues with the async sending for the poll sender. It's not connecting to the web socket.

To run the front end:
cd voting-fe
npm install
npm start

To run the back end:
cd voting_be
Create an env
pip install -r requirements.txt
daphne -b 0.0.0.0 -p 8001 voting_be.asgi:application -u 6
