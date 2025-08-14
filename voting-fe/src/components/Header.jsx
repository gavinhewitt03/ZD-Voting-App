import { Button } from "./Button";
import { useNavigate } from "react-router-dom"
import React, { useEffect, useRef } from 'react'
import { w3cwebsocket as W3CWebSocket } from 'websocket'

export function Header({ setLoggedIn, displayLogout, user_full_name, sendLogoutMessage }) {
    const navigate = useNavigate();

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

                
                sendLogoutMessage();
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
    user_full_name: "",
    sendLogoutMessage: () => {}
}