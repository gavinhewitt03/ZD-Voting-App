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
    const [userGroups, setUserGroups] = useState([]);
    const [content, setContent] = useState(null);
    
    useEffect(() => {
        if (userGroups.includes("Standards"))
            setContent(<Standards />);
        else if (userGroups.includes("Regent"))
            setContent(<Regent />);
        else if (userGroups.includes("Administrator"))
            setContent(<User />);
        else
            setContent(<Poll />);
        
    });

    return (
        <Router>
            <Routes>
                <Route path="/" element={ 
                    <LoginPage 
                        setUserGroups={setUserGroups}
                    /> 
                } />
                <Route path="/users" element={ <User /> } />
                <Route path="/home" element = { content } />
                <Route path="/createuser" element={ <CreateUser /> } />
            </Routes>
        </Router>
     );
}

export default App;
