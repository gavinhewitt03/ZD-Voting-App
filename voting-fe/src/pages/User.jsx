import { Header } from '../components/Header'
import { ToggleSlider } from 'react-toggle-slider'
import { Button } from '../components/Button'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

async function UpdateIsActive(user) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/user/update_is_active/`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
}

export function User() {
    const [userList, setUserList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();
        
    useEffect(() => {
        const fetchUserList = async () => {
            try {
                setIsLoading(true);
    
                const response = await fetch(`${process.env.REACT_APP_API_URL}/user/get_users`);
    
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
                const token = localStorage.getItem('accessToken');

                if (token) {
                    const config = {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/user/get_user`, config);
                    
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

    if (isLoading) return <p>Loading...</p>;

    return(
        <>
            <Header />
            { loggedIn && 
                <div style={{ marginTop: '8vh'}}>
                    <table className="user-table">
                        <tr>
                            <td  style={{ width: '40%' }}>
                                <p className='user-table-text'>
                                    Email
                                </p>
                            </td>
                            <td style={{ width: '20%' }}>
                                <p className='user-table-text'>
                                    First Name
                                </p>
                            </td>
                            <td style={{ width: '20%' }}>
                                <p className='user-table-text'>
                                    Last Name
                                </p>
                            </td>
                            <td style={{ width: '10%' }}>
                                <p className='user-table-text'>
                                Active
                                </p>
                            </td>
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
                                            clickFunc={() => {}}
                                            className="yellow"
                                        />
                                    </td>
                                </tr>
                            ))
                        }
                    </table>
                </div>
            }
            
            
        </>
    );
}