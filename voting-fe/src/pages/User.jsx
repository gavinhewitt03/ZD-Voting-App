import { Header } from '../components/Header'
import { ToggleSlider } from 'react-toggle-slider'
import { Button } from '../components/Button'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

async function UpdateIsActive(user) {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/user/update_is_active/`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(user)
    });
}

export function User() {
    const [userList, setUserList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();
    
    const token = localStorage.getItem('accessToken');
    useEffect(() => {
        const fetchUserList = async () => {
            try {
                setIsLoading(true);
    
                const response = await fetch(`${process.env.REACT_APP_API_URL}/user/get_users/`);
    
                const data = await response.json();

                setUserList(data);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }

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
                    if (response.ok) {
                        setLoggedIn(true);
                        fetchUserList();
                    } else {
                        navigate('/');
                    }
                }
            } catch(error) {
                console.log(error);
            }
        };

        authenticate();
    }, []);

    const clearLogIn = async () => {
        await fetch(`${process.env.REACT_APP_API_URL}/user/clear/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    };

    const deleteGrads = async () => {
        if (window.confirm("This will delete all users who have graduated today or earlier. Do you want to do this?")) {
            await fetch(`${process.env.REACT_APP_API_URL}/user/delete_grads/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        }
    }

    const forceLogout = async (fullName) => {
        await fetch(`${process.env.REACT_APP_API_URL}/user/force/`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                'full_name': fullName
            })
        })
    };

    if (isLoading) return <p>Loading...</p>;

    return(
        <>
            <Header />
            { loggedIn && 
                <>
                    <div style={{display: 'flex', marginTop: '1vh'}} className="right-align">
                        <Button
                            label="Clear Log In"
                            clickFunc={() => clearLogIn()}
                            className="yellow"
                        />
                        &emsp;
                        <Button
                            label="Delete Graduated"
                            clickFunc={() => deleteGrads()}
                            className="yellow"
                        />
                    </div>
                    <div style={{ marginTop: '8vh'}}>
                        <table className="user-table">
                            <tr>
                                <td  style={{ width: '30%' }}>
                                    <p className='user-table-text'>
                                        Email
                                    </p>
                                </td>
                                <td style={{ width: '15%' }}>
                                    <p className='user-table-text'>
                                        First Name
                                    </p>
                                </td>
                                <td style={{ width: '15%' }}>
                                    <p className='user-table-text'>
                                        Last Name
                                    </p>
                                </td>
                                <td style={{ width: '10%'}}>
                                    <p className='user-table-text'>
                                    Grad Year
                                    </p>
                                </td>
                                <td style={{ width: '10%' }}>
                                    <p className='user-table-text'>
                                    Active
                                    </p>
                                </td>
                                <td style={{ width: '10%' }}></td>
                                <td style={{ width: '10%' }}></td>
                            </tr>
                            {
                                userList.map(user => (
                                    <tr key={user.id}>
                                        <td>
                                            <p className='user-table-text'>
                                                {user.email}
                                            </p>
                                        </td>
                                        <td className='user-table-text'>
                                            <p className='user-table-text'>
                                                {user.first_name}
                                            </p>
                                        </td>
                                        <td className='user-table-text'>
                                            <p className='user-table-text'>
                                                {user.last_name}
                                            </p>
                                        </td>
                                        <td className='user-table-text'>
                                            <p className='user-table-text'>
                                                {user.grad_year}
                                            </p>
                                        </td>
                                        <td>
                                            <div className='flex-box'>
                                                <ToggleSlider
                                                    active={user.is_active}
                                                    barBackgroundColorActive='#FC3'
                                                    onToggle={() => UpdateIsActive(user)}
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <Button
                                                label="Logout"
                                                clickFunc={() => forceLogout(`${user.first_name} ${user.last_name}`)}
                                                className="yellow"
                                            />
                                        </td>
                                        <td style={{ paddingLeft: '2px', paddingRight: '2px' }}>
                                            <Link to={{
                                                pathname: "changepassword",
                                                search: `email=${user.email}`
                                            }}
                                            >
                                                <Button
                                                    label="Change Password"
                                                    clickFunc={() => {}}
                                                    className="yellow"
                                                />
                                            </Link>
                                            
                                        </td>
                                        <td style={{ paddingLeft: '2px', paddingRight: '2px' }}>
                                            <Link to={{
                                                pathname: "updateuser",
                                                search: `email=${user.email}`
                                            }}
                                            >
                                                <Button
                                                    label="Edit User"
                                                    clickFunc={() => {}}
                                                    className="yellow"
                                                />
                                            </Link>
                                            
                                        </td>
                                    </tr>
                                ))
                            }
                        </table>
                    </div>
                </> 
            }
        </>
    );
}