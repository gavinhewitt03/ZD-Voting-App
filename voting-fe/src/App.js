import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { User } from './pages/User'
import { Regent } from './pages/Regent'
import { Standards } from './pages/Standards'
import { Poll } from './pages/Poll'
import { CreateUser } from './pages/CreateUser'
import React, { useState, useEffect, useRef } from 'react'

function App() {
    const userGroups = useRef([]);
    const [, forceUpdate] = useState(false);

    const updateUserGroups = (groups) => {
        userGroups.current = groups;
        forceUpdate((prev) => !prev);
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={ 
                    <LoginPage 
                        updateUserGroups={updateUserGroups}
                    /> 
                } />
                <Route path="/home" element = {
                    userGroups.current.includes("Standards") ? (
                        <Standards />
                    ) : userGroups.current.includes("Regent") ? (
                        <Regent />
                    ) : userGroups.current.includes("Administrator") ? (
                        <User />
                    ) : (
                        <Poll />
                    )
                } />
                <Route path="/createuser" element={ <CreateUser /> } />
            </Routes>
        </Router>
     );
}

export default App;
