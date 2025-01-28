import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { User } from './pages/User'
import { Regent } from './pages/Regent'
import { Standards } from './pages/Standards'
import { Poll } from './pages/Poll'
import { CreateUser } from './pages/CreateUser'
import React, { useState, useEffect } from 'react'

function App() {
    const userGroups = useRef([]);

    return (
        <Router>
            <Routes>
                <Route path="/" element={ 
                    <LoginPage 
                        userGroups={userGroups}
                    /> 
                } />
                <Route path="/home" element = {
                    userGroups.length === 0 ? (
                        <h1>Loading...</h1>
                    ) : userGroups.includes("Standards") ? (
                        <Standards />
                    ) : userGroups.includes("Regent") ? (
                        <Regent />
                    ) : userGroups.includes("Administrator") ? (
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
