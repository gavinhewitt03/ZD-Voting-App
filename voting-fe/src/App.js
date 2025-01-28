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
        const storedGroupsJSON = JSON.parse(localStorage.getItem("groups"));

        console.log("local storage groups: ", storedGroupsJSON);
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

        userGroups.includes("Standards") ? (
            setContent(<Standards />)
        ) : userGroups.includes("Regent") ? (
            setContent(<Regent />)
        ) : userGroups.includes("Administrator") ? (
            setContent(<User />)
        ) : (
            setContent(<Poll />)
        )

        console.log('user groups: ', userGroups);
    }, []);
    
    // useEffect(() => {
    //     if (userGroups.includes("Standards"))
    //         setContent(<Standards />);
    //     else if (userGroups.includes("Regent"))
    //         setContent(<Regent />);
    //     else if (userGroups.includes("Administrator"))
    //         setContent(<User />);
    //     else
    //         setContent(<Poll />);
        
    // }, [userGroups]);

    return (
        <Router>
            <Routes>
                <Route path="/" element={ 
                    <LoginPage 
                        setUserGroups={setUserGroups}
                    /> 
                } />
                <Route path="/home" element = { content } />
                <Route path="/createuser" element={ <CreateUser /> } />
            </Routes>
        </Router>
     );
}

export default App;
