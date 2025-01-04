import React, { useState } from 'react';
import { Header } from '../components/Header'

function Login() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const updateValue = (event, updateFunc) => {
        updateFunc(event.target.value);
    };

    return(
        <div className='login'>
            <h2>Sign in</h2>

            <div style={{display: 'block', textAlign: 'center'}}>
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