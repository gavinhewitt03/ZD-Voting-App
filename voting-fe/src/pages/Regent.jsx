import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RemainingVotes } from "../components/RemainingVotes"
import { Header } from "../components/Header"

let remainingVoters = ['Gavin Hewitt', 'Jackson Ginn', 'Shannon DePratter', 'Kelly Sullivan', 'Grace Yaegel']

export function Regent() {
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
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/user/get_user`, config);
                    
                    const data = await response.json();
                    console.log(data);
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
            <RemainingVotes 
                remainingVoters={remainingVoters}
                className="remaining-votes-regent"
            />
        </>
        
    );
}