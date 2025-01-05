import React, { useState } from 'react';
import { Header } from '../components/Header'
import { Button } from '../components/Button'

function Login() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const updateValue = (event, updateFunc) => {
        updateFunc(event.target.value);
    };

    const login = async () => {
        try {
            const response = await fetch();
        } catch (error) {

        }
    }

    return(
        <div className='login'>
            <h2>Sign in</h2>

            <div className="center">
                <div style={{display: 'inline-block'}}>
                    <p className='login-text'>Username:</p>
                    <input 
                        type="text"
                        value={userName}
                        onChange={(event) => updateValue(event, setUserName)}
                    />
                </div>
                <br />
                <div style={{display: 'inline-block'}}>
                    <p className='login-text'>Password:</p>
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => updateValue(event, setPassword)}
                    />
                </div>
            </div>

            <div className='center' style={{marginTop: '15px'}}>
                <Button
                    label="Login"
                    clickFunc={() => {}}
                    style="yellow"
                />
                &emsp;
                <Button
                    label="Create User"
                    clickFunc={() => {}}
                    style="yellow"
                />
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