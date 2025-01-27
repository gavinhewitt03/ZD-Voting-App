import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { StandardsPoll } from '../components/StandardsPoll';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

export function Standards() {
    const [sessionID, setSessionID] = useState("");
    const [sessionInput, setSessionInput] = useState("");

    const [content, setContent] = useState("Inactive");

    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();

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
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/user/get_user/`, config);
                    
                    const data = await response.json();
                    if (response.ok && data['groups'].includes('Standards')) {
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


    });

    const client = useRef(null);
    useEffect(() => {
        if (sessionID.length === 0) { // check if empty string
            setContent("Inactive");
            return;
        }
        
        client.current = new W3CWebSocket(`${process.env.REACT_APP_WS_URL}${sessionID}/`);

        client.current.onopen = () => {
            setContent("Active");
            console.log('WebSocket client connected: ', `${process.env.REACT_APP_WS_URL}${sessionID}/`);
        };

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
                setContent("Inactive");
            }
        }
    }, [sessionID]);

    const updateSession = () => {
        setSessionID(sessionInput);
        setSessionInput("");
    }

    const renderContent = () => {
        switch(content) {
            case "Active":
                return (
                    <div style={{display: 'flex'}}>
                        <StandardsPoll 
                            sessionID={sessionID}
                         />
                    </div>
                );
            default:
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
                            label="Begin Session"
                            clickFunc={updateSession}
                            className="red"
                        />
                    </div>
                );
        }
    }

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
            <Header />
            { renderContent() }
        </>
    );
}