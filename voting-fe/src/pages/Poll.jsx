import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Header } from '../components/Header'
import { w3cwebsocket as W3CWebSocket } from 'websocket'

export function Poll() {
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();

    const [content, setContent] = useState("NoSession");
    const [isLoading, setIsLoading] = useState(false);
    const [rusheeName, setRusheeName] = useState("");

    const [sessionID, setSessionID] = useState("");
    const [sessionInput, setSessionInput] = useState("");

    const user_email = useRef(null);
    const user_full_name = useRef(null);
    useEffect(() => {
        const authenticate = async () => {
            try {
                const token = localStorage.getItem('accessToken');

                if (token) {
                    const config = {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/user/get_user`, config);
                    
                    const data = await response.json();
                    user_email.current = data['email'];
                    user_full_name.current = data['first_name'] + ' ' + data['last_name'];

                    if (response.ok) {
                        setLoggedIn(true);
                    } else {
                        navigate('/');
                    }
                }
            } catch(error) {
                console.log(error);
            }
        };

        authenticate();
    }, []);

    useEffect(() => {
        const hasVoted = async () => {
            if (!rusheeName || rusheeName.length === 0)
                return;

            setIsLoading(true);

            const params = {rushee_name: rusheeName, email: user_email.current};
            const queryParams = new URLSearchParams(params).toString();
            const response = await fetch(`${process.env.REACT_APP_API_URL}/poll/voted/?${queryParams}`)

            const has_voted = (await response.json())['has_voted'];
            console.log(has_voted);

            if (!has_voted) {
                setIsLoading(false);
                return;
            }

            setContent("ActiveVoted");
            setIsLoading(false);
        };

        hasVoted();
    }, [sessionID, rusheeName]);

    const client = useRef(null);
    useEffect(() => {
        if (sessionID.length === 0) { // check if empty string
            setContent("NoSession");
            return;
        }
        
        client.current = new W3CWebSocket(`${process.env.REACT_APP_WS_URL}${sessionID}/`);

        client.current.onopen = () => {
            setContent("Inactive");
            console.log('WebSocket client connected: ', `${process.env.REACT_APP_WS_URL}${sessionID}/`);
        };

        client.current.onmessage = (message) => {
            let messageJson = JSON.parse(message['data']);
            console.log(messageJson);

            setRusheeName((name) => {
                if (messageJson['name'] === 'standards' || messageJson['name'] === 'history')
                    return messageJson['message']['rushee_name'];
                return name;
            });
        }

        client.current.onclose = (event) => {
            console.log("WebSocket client disconnected: ", event.reason);
            setContent("Inactive");
        }

        client.current.onerror = (error) => {
            console.error("WebSocket error: ", error);
        }

        return () => {
            if (client.current) {
                client.current.close();
                console.log("WebSocket connection closed via cleanup.");
                setContent("NoSession");
            }
        }
    }, [sessionID]);

    useEffect(() => {
        if (sessionID.length === 0)
            return;

        if (!rusheeName || rusheeName.length === 0)
            setContent("Inactive");
        else
            setContent("Active");
    }, [rusheeName, sessionID]);

    const SendVote = async (vote) => {
        let data = {
            'rushee_name': rusheeName,
            'vote': vote,
            'email': user_email.current
        };

        const response = await fetch(`${process.env.REACT_APP_API_URL}/poll/vote/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!client.current || client.current.readyState !== WebSocket.OPEN) {
            console.error("WebSocket not connected. Cannot send rushee name.");
            setContent("NoSession");
            return;
        }

        client.current.send(JSON.stringify({
            type: 'message',
            message: 'voted',
            name: user_full_name.current
        }));

        if (response.ok)
            setContent("ActiveVoted");
        else
            setContent("VoteFailed");
    }

    const updateSession = () => {
        setSessionID(sessionInput);
        setSessionInput("");
    }

    const renderContent = () => {
        if (isLoading) {
            return (
                <h1 className="red">Loading...</h1>
            );
        }
        
        switch(content) {
            case "Active":
                return (
                    <>
                        <div style={{ marginTop: '100px' }}>
                            <h2 className="red"> { rusheeName } </h2>
                        </div>
                        <div className='center' style={{marginTop: '45px'}}>
                            <Button
                                label="Yes"
                                clickFunc={ () => SendVote('yes') }
                                className="red"
                            />
                            &emsp;
                            <Button
                                label="I Don't Know"
                                clickFunc={ () => SendVote('idk') }
                                className="red"
                            />
                            &emsp;
                            <Button
                                label="No"
                                clickFunc={ () => SendVote('no') }
                                className="red"
                            />
                            </div>
                    </>
                );
            case "ActiveVoted":
                return (
                    <>
                        <div style={{ marginTop: '100px' }}>
                            <h2 className="red"> Your vote has been recorded. </h2>
                        </div>
                    </>
                );
            case "VoteFailed":
                return (
                    <>
                        <div style={{ marginTop: '100px' }}>
                            <h2 className="red"> There was an issue recording your vote. Please logout and log back in and try again. </h2>
                        </div>
                    </>
                );
            case "NoSession":
                return (
                    <div className="poll-section">
                        <h3 className="red" style={{textDecorationLine: 'none'}}>
                            Session ID:
                        </h3>
                        <input 
                            type="text" 
                            value={sessionInput}
                            onChange={(event) => setSessionInput(event.target.value)}
                        />
                        <br />
                        <br />
                        <Button
                            label="Join Session"
                            clickFunc={updateSession}
                            className="red"
                        />
                    </div>
                );
            default:
                return (
                    <h2 className="red">
                        Please wait for Standards to start the poll.
                    </h2>
                );
        }
    }

    const sendLogoutMessage = () => {
        client.current.send(JSON.stringify({
            type: 'message',
            message: 'logged out',
            name: user_full_name.current
        }));
    };

    if (!loggedIn) {
        return (
            <>
                <Header />
                <h2 className="error">
                    You are not authorized to view this page. Redirecting to login screen.
                </h2>
            </>
        );
    }

    return (
        <>
            <Header 
                setLoggedIn={setLoggedIn}
                displayLogout={true}
                user_full_name={user_full_name}
                sendLogoutMessage={sendLogoutMessage}
            />
            { renderContent() }
        </>
    );
}