import React, { useState } from 'react'
import { Button } from '../components/Button'
import { Header } from '../components/Header'
import { Link } from 'react-router-dom'

function InputField(text, stateVar, stateFunc) {
    return (
        <div style={{display: 'inline-block'}}>
            <p className="login-text">
                {text}
            </p>
            <input
                type="text"
                value={stateVar}
                onChange={(event) => stateFunc(event.target.value)}
            />
        </div>
    )
}

export function CreateUser() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const createUser = async () => {
        let user = {
            'first_name': firstName,
            'last_name': lastName,
            'email': email,
            'password': password
        }
    }

    return (
        <>
            <Header />
            <div className="login">
                <h2> Create User </h2>

                { InputField("First Name:", firstName, setFirstName) }
                <br />
                { InputField("Last Name:", lastName, setLastName) }
                <br />
                { InputField("Email:", email, setEmail) }
                <br />
                { InputField("Password:", password, setPassword) }

                <div style={{marginTop: '15px'}}>
                    <Link to="/home">
                        <Button
                            label="Create User"
                            clickFunc={() => {}}
                            className="yellow"
                        />
                    </Link>
                    &emsp;
                    <Link to="/">
                        <Button
                            label="Cancel"
                            clickFunc={() => {}}
                            className="yellow"
                        />
                    </Link>
                </div>
            </div>

            
        </>
    )
}