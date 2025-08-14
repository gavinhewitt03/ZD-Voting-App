import React, { useState, useEffect } from 'react'
import { Header } from '../components/Header'
import { Button } from '../components/Button'
import { InputField } from '../components/InputField'
import { useNavigate } from 'react-router-dom'

export function ChangePassword() {
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");
    const navigate = useNavigate();

    const [password, setPassword] = useState("");

    const token = localStorage.getItem('accessToken');
    const changePassword = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/change_password/`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    'email': email,
                    'password': password
                })
            });

            if (response.ok) {
                navigate("/home");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Header />
            <div className="poll-section">
                <h3 className="red" style={{textDecorationLine: 'none'}}>
                    Update password for {email}
                </h3>
                <input 
                    type="password" 
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />
                <br />
                <br />
                <Button
                    label="Update Password"
                    clickFunc={changePassword}
                    className="red"
                />
            </div>
        </>
    )
}