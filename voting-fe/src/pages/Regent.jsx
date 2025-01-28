import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { RemainingVotes } from "../components/RemainingVotes"
import { Button } from '../components/Button'
import { Header } from "../components/Header"
import { w3cwebsocket as W3CWebSocket } from 'websocket'

export function Regent() {
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();

    const [remainingVoters, setRemainingVoters] = useState([]);
    const [rusheeName, setRusheeName] = useState("");

    const [sessionID, setSessionID] = useState("");
    const [sessionInput, setSessionInput] = useState("");

    const [content, setContent] = useState("Inactive");

    useEffect(() => {
        const authenticate = async () => {
            try {
                const token = localStorage.getItem('accessToken');

                console.log(token);

                if (token) {
                    const config = {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/user/get_user`, config);
                    
                    const data = await response.json();

                    console.log(data['email']);
                    if (response.ok && data['groups'].includes('Regent')) {
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
            return;
        }
        
        if (client.current && client.current.readyState === WebSocket.OPEN) // do not reinitialize socket if it already exists on remount
            return;

        client.current = new W3CWebSocket(`${process.env.REACT_APP_WS_URL}${sessionID}/`);

        client.current.onopen = () => {
            setContent("Active");
            console.log('WebSocket client connected: ', `${process.env.REACT_APP_WS_URL}${sessionID}/`);
        };

        client.current.onmessage = async (message) => {
            console.log(message);
            let messageJson = JSON.parse(message['data']);

            if (messageJson['name'] === 'for_regent' && messageJson['message'] === 'get_logged_in') {
                const getResponse = await fetch(`${process.env.REACT_APP_API_URL}/user/get_logged_in/`);
                const getData = await getResponse.json();
                
                let voters = [];
                getData.forEach((jsonVoter, i) => {
                    voters.push(jsonVoter['full_name'])
                });

                setRemainingVoters(voters);
            }

            if (messageJson['name'] === 'standards' && messageJson['message']['rushee_name']) {
                setRusheeName(messageJson['message']['rushee_name']);
                setRemainingVoters((voters) => {
                    if (!rusheeName || rusheeName.length === 0) {
                        return [];
                    }
                        
                    return voters;
                })
            }
            
            if (messageJson['message'] === 'voted' || messageJson['message'] === 'logged out') {
                let removeName = messageJson['name'];
                setRemainingVoters((voters) => {
                    if (voters.includes(removeName)) {
                        const updatedVoters = remainingVoters.filter(voter => voter !== removeName);
                        return updatedVoters;
                    }
                    return voters;
                });
            }
        }

        client.current.onclose = (event) => {
            console.log("WebSocket client disconnected: ", event.reason);
        }

        client.current.onerror = (error) => {
            console.error("WebSocket error: ", error);
        }

        return () => {
            if (client.current) {
                client.current.close();
                console.log("WebSocket connection closed via cleanup.");
            }
        }
    }, [sessionID, remainingVoters]);

    const updateSession = () => {
        setSessionID(sessionInput);
        setSessionInput("");
    }

    const renderContent = () => {
            switch(content) {
                case "Active":
                    return (
                        <RemainingVotes
                            remainingVoters={remainingVoters}
                            className="remaining-votes-regent"
                        />
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

    return(
        <>
            <Header />
            { renderContent() }
        </>
        
    );
}