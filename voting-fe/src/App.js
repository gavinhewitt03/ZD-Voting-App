import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { User } from './pages/User'
import { Regent } from './pages/Regent'
import { Standards } from './pages/Standards'
import { Poll } from './pages/Poll'
import { CreateUser } from './pages/CreateUser'
import { ChangePassword } from './pages/ChangePassword';
import { UpdateUser } from './pages/UpdateUser';
import React, { useState, useEffect } from 'react'

function App() {
    const [userGroups, setUserGroups] = useState([]);
    const [content, setContent] = useState(null);

    useEffect(() => {
        const storedGroupsJSON = JSON.parse(localStorage.getItem("groups"));

        setUserGroups((prevGroups) => {
            if (storedGroupsJSON) {
                storedGroupsJSON.forEach((group) => {
                    if (!prevGroups.includes(group)) { 
                        prevGroups.push(group) 
                    }
                });
            }
            return prevGroups;
        });
    }, []);

    useEffect(() => {
        userGroups.includes("Standards") ? (
            setContent(<Standards />)
        ) : userGroups.includes("Regent") ? (
            setContent(<Regent />)
        ) : userGroups.includes("Administrator") ? (
            setContent(<User />)
        ) : (
            setContent(<Poll />)
        )
    }, [userGroups]);

    return (
        <Routes>
            <Route path="/" element={ 
                <LoginPage 
                    setUserGroups={setUserGroups}
                /> 
            } />
            <Route path="/home" element = { content } />
            <Route path="/createuser" element={ <CreateUser /> } />
            <Route path="/home/changepassword" element={ <ChangePassword /> } />
            <Route path="/home/updateuser" element={ <UpdateUser /> } />
        </Routes>
     );
}

export default App;
