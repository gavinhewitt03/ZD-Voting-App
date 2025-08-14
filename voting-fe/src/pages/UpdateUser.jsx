import React, { useState, useEffect } from 'react'
import { Header } from '../components/Header'
import { Button } from '../components/Button'
import { InputField } from '../components/InputField'
import { Link, useNavigate } from 'react-router-dom'

export function UpdateUser() {
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");

    const [errorMessage, setErrorMessage] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        'first_name': '',
        'last_name': '',
        'email': '',
        'grad_year': ''
    });

    
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        const authenticate = async () => {
            try {
                if (token) {
                    const config = {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/user/get_user/`, config);
                    
                    const data = await response.json();
                    if (response.ok && data['groups'].includes('Administrator')) {
                        setLoggedIn(true);
                    } else {
                        navigate('/');
                    }
                }
            } catch(error) {
                console.log(error);
            }
        };

        const retrieveUserData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/user/get_user_info/`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        'email': email
                    })
                });

                if (response.ok) {
                    const data = await response.json();

                    setFormData(prev => ({
                        ...prev,
                        first_name: data.first_name,
                        last_name: data.last_name,
                        email: data.email,
                        grad_year: data.grad_year
                    }))

                } else {
                    navigate("/");
                }
            } catch (error) {
                console.log(error);
            }
        };

        authenticate();
        retrieveUserData(); 
    }, []);

    const toProperCase = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isLoading)
            return;

        setIsLoading(true);
        
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/update/`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    'original_email': email,
                    'first_name': formData['first_name'],
                    'last_name': formData['last_name'],
                    'email': formData['email'] ? formData['email'].toLowerCase() : '',
                    'grad_year': formData['grad_year'] ? formData['grad_year'] : ''
                })
            });

            const data = await response.json();
            
            if (data['error']) {
                setErrorMessage(toProperCase(Object.values(data['error'])[0][0]));
            }

            if (response.ok)
                navigate('/home');
        } catch (error) {
            setErrorMessage(toProperCase(Object.values(error)[0][0]));
        } finally {
            setIsLoading(false);
        }
    };
    
    const deleteUser = async () => {
        if (window.confirm("This will delete this user permanently. Do you want to do this?")) {
            await fetch(`${process.env.REACT_APP_API_URL}/user/delete/`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    'email': email
                })
            });

            navigate("/home");
        }
    };

    return (
        <>
        <Header />
            <div className="login">
                <form>
                    <h2> Update User </h2>
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
                        text="Graduation Year: (select the last day of the month)"
                        stateVar={formData.grad_year}
                        stateFunc={handleChange}
                        name="grad_year"
                        type="date"
                    />
                    <br />
                    <InputField
                        text="Email:"
                        stateVar={formData.email}
                        stateFunc={handleChange}
                        name="email"
                    />
                    <br />
                    <div style={{marginTop: '15px', marginBottom: '15px'}}>
                        <Link to="/home">
                            <Button
                                label="Update User"
                                clickFunc={handleSubmit}
                                className="yellow"
                                type="submit"
                                disabled={isLoading}
                            />
                        </Link>
                        &emsp;
                        <Link to="/home">
                            <Button
                                label="Cancel"
                                clickFunc={() => {}}
                                className="yellow"
                            />
                        </Link>
                        &emsp;
                        <Button
                            label="Delete User"
                            clickFunc={deleteUser}
                            className="yellow"
                        />
                    </div>
                </form>    
            </div>
        </>
    )
}