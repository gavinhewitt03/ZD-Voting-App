import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { User } from './pages/User'
import { Regent } from './pages/Regent'
import { Standards } from './pages/Standards'
import { Poll } from './pages/Poll'
import { CreateUser } from './pages/CreateUser';

let content;

let user = {
    "name": "Gavin",
    "groups": ["Admin"]
};

let groups = user["groups"];

if (groups.includes("Standards"))
    content = <Standards />
else if (groups.includes("Regent"))
    content = <Regent />
else if (groups.includes("Admin"))
    content = <User />
else
    content = <Poll />

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={ <LoginPage /> } />
                <Route path="/users" element={ <User /> } />
                <Route path="/home" element = { content } />
                <Route path="/createuser" element={ <CreateUser /> } />
            </Routes>
        </Router>
     );
}

export default App;
