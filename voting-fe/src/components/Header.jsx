import { Button } from "./Button";
import { useNavigate } from "react-router-dom"
import React, { useEffect, useRef } from 'react'
import { w3cwebsocket as W3CWebSocket } from 'websocket'

export function Header({ setLoggedIn, displayLogout, sessionID, user_full_name }) {
    const navigate = useNavigate();

    const client = useRef(null);
        useEffect(() => {
            if (sessionID.length === 0) { // check if empty string
                return;
            }
            
            client.current = new W3CWebSocket(`${process.env.REACT_APP_WS_URL}${sessionID}/`);
    
            client.current.onopen = () => {
                console.log('WebSocket client connected: ', `${process.env.REACT_APP_WS_URL}${sessionID}/`);
            };
    
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
        }, [sessionID]);

    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            const accessToken = localStorage.getItem("accessToken");
            if (refreshToken && accessToken) {
                await fetch(`${process.env.REACT_APP_API_URL}/user/logout/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'refresh': refreshToken,
                        'full_name': user_full_name.current
                    }) 
                });

                client.current.send(JSON.stringify({
                    type: 'message',
                    message: 'logged out',
                    name: user_full_name.current
                }));
    
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                setLoggedIn(false);
                navigate('/');
            }
            
        } catch(error) {
            console.log('There was an error logging out: ' + error);
        }
    };

    return(
        <div className="header">
            <h1>Z∆ Voting App</h1>
            
            { displayLogout &&
                <div className="right-align">
                    <Button
                        label="Logout"
                        clickFunc={logout}
                        className="yellow"
                    />
                </div>
            }
        </div>
    );
}

Header.defaultProps = {
    setLoggedIn: () => {},
    displayLogout: false,
    sessionID: "",
    user_full_name: ""
}