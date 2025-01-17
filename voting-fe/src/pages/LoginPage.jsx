import React, { useState } from 'react'
import { Header } from '../components/Header'
import { Button } from '../components/Button'
import { Link } from 'react-router-dom'

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {
        let user = {
            'email': email,
            'password': password
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/login/`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

            console.log(response.json());
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <div className='login'>
            <h2>Sign in</h2>

            <div className="center">
                <div style={{display: 'inline-block'}}>
                    <p className='login-text'>Email:</p>
                    <input 
                        type="text"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>
                <br />
                <div style={{display: 'inline-block'}}>
                    <p className='login-text'>Password:</p>
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>
            </div>

            <div className='center' style={{marginTop: '15px'}}>
                <Link to="/home">
                    <Button
                        label="Login"
                        clickFunc={() => { login() }}
                        className="yellow"
                    />
                </Link>
                &emsp;
                <Link to="/createuser">
                    <Button
                        label="Create User"
                        clickFunc={() => {}}
                        className="yellow"
                    />
                </Link>
            </div>
        </div>
    );
}

export function LoginPage() {
    return(
        <>
            <Header />
            <Login />
        </>
    );
}