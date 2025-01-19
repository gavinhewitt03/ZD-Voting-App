import { Button } from "./Button";
import { useNavigate } from "react-router-dom";

async function Logout(setLoggedIn, navigate) {
    try {
        const refreshToken = localStorage.getItem("refreshToken");
        const accessToken = localStorage.getItem("accessToken");
        if (refreshToken && accessToken) {
            await fetch(`${process.env.REACT_APP_API_URL}/user/logout/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'refresh': refreshToken
                }) 
            });

            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setLoggedIn(false);
            navigate('/');
        }
        
    } catch(error) {
        console.log('There was an error logging out: ' + error);
    }
}

export function Header({ setLoggedIn, displayLogout }) {
    const navigate = useNavigate();

    return(
        <div className="header">
            <h1>Z∆ Voting App</h1>
            
            { displayLogout &&
                <div className="right-align">
                    <Button
                        label="Logout"
                        clickFunc={() => Logout(setLoggedIn, navigate)}
                        className="yellow"
                    />
                </div>
            }
        </div>
    );
}

Header.defaultProps = {
    setLoggedIn: () => {},
    displayLogout: false
}