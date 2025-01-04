import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { User } from './pages/User'
import { Regent } from './pages/Regent'
import { Standards } from './pages/Standards'
import { Poll } from './pages/Poll'

let content;

let user = {
    "name": "Gavin",
    "groups": ["Standards"]
};

let groups = user["groups"];

if (groups.includes("Standards"))
    content = <Standards />
else if (groups.includes("Regent"))
    content = <Regent />
else
    content = <Poll />

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={ <LoginPage /> } />
                <Route path="/users" element={ <User /> } />
                <Route path="/home" element = { content } />
            </Routes>
        </Router>
     );
}

export default App;
