import React, { useState } from 'react'
import { Header } from '../components/Header'
import { Button } from '../components/Button'
import { Link, useNavigate } from 'react-router-dom'
import { InputField } from '../components/InputField'

function Login({ setUserGroups }) {
    const [formData, setFormData] = useState({
        'email':'',
        'password':''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    const login = async (event) => {
        event.preventDefault();

        if (isLoading)
            return;

        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/login/`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'email': formData['email'],
                    'password': formData['password']
                })
            });

            const data = await response.json();
            if (response.ok) {
                setUserGroups(data['groups']);
                localStorage.setItem('accessToken', data['tokens']['access']);
                localStorage.setItem('refreshToken', data['tokens']['refresh']);
                navigate('/home');
            } else {
                setErrorMessage(data['non_field_errors'][0]);
            }

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    }

    return(
        <div className='login'>
            <form>
                <h2 style={{margin: '2vh'}}>
                    Sign in
                </h2>

                { errorMessage && 
                    <>
                        <p className='yellow'>
                            {errorMessage}
                        </p>
                        <br />
                    </>
                }

                <div className="center">
                    <InputField
                        text="Email"
                        stateVar={formData.email}
                        stateFunc={handleChange}
                        name="email"
                    /> 
                    <br />
                    <InputField
                        text="Password"
                        stateVar={formData.password}
                        stateFunc={handleChange}
                        name="password"
                        type="password"
                    /> 
                </div>

                <div className='center' style={{marginTop: '15px'}}>
                    <Button
                        label="Login"
                        clickFunc={login}
                        className="yellow"
                        type="submit"
                        disabled={isLoading}
                    />
                    &emsp;
                    <Link to="/createuser">
                        <Button
                            label="Create User"
                            clickFunc={() => {}}
                            className="yellow"
                        />
                    </Link>
                </div>
            </form>
            
        </div>
    );
}

export function LoginPage({ setUserGroups }) {
    return(
        <>
            <Header />
            <Login 
                setUserGroups={setUserGroups}
            />
        </>
    );
}