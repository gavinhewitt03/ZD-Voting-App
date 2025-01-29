import React, { useState } from 'react'
import { Button } from '../components/Button'
import { Header } from '../components/Header'
import { Link, useNavigate } from 'react-router-dom'
import { InputField } from '../components/InputField';

export function CreateUser() {
    const [formData, setFormData] = useState({
       'first_name': '',
       'last_name': '',
       'email': '',
       'password1': '',
       'password2': ''
    });
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]:[event.target.value]
        });
    };

    const [isLoading, setIsLoading] = useState(false);

    const toProperCase = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isLoading)
            return;

        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/register/`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'first_name': formData['first_name'][0],
                    'last_name': formData['last_name'][0],
                    'email': formData['email'][0],
                    'password1': formData['password1'][0],
                    'password2': formData['password2'][0]
                })
            });

            const data = await response.json();
            
            if (data['error']) {
                setErrorMessage(toProperCase(Object.values(data['error'])[0][0]));
            }

            if (response.ok)
                navigate('/');
        } catch (error) {
            setErrorMessage(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div className="login">
                <form>
                    <h2> Create User </h2>
                    {errorMessage && 
                        <>
                            <br />
                            <p className="login-text" style={{textAlign: 'center'}}>
                                {errorMessage}
                            </p>
                            <br />
                        </>
                    }
                    <InputField
                        text="First Name:"
                        stateVar={formData.first_name}
                        stateFunc={handleChange}
                        name="first_name"
                    /> 
                    <br />
                    <InputField
                        text="Last Name:"
                        stateVar={formData.last_name}
                        stateFunc={handleChange}
                        name="last_name"
                    />
                    <br />
                    <InputField
                        text="Email:"
                        stateVar={formData.email}
                        stateFunc={handleChange}
                        name="email"
                    /> 
                    <br />
                    <InputField
                        text="Password:"
                        stateVar={formData.password1}
                        stateFunc={handleChange}
                        name="password1"
                        type="password"
                    /> 
                    <br />
                    <InputField
                        text="Confirm Password"
                        stateVar={formData.password2}
                        stateFunc={handleChange}
                        name="password2"
                        type="password"
                    /> 

                    <div style={{marginTop: '15px', marginBottom: '15px'}}>
                        <Link to="/">
                            <Button
                                label="Create User"
                                clickFunc={handleSubmit}
                                className="yellow"
                                type="submit"
                                disabled={isLoading}
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
                </form>    
            </div>
        </>
    )
}