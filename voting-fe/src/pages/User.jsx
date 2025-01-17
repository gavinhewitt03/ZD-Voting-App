import { Header } from '../components/Header'
import { ToggleSlider } from 'react-toggle-slider'
import { Button } from '../components/Button'

let test_users = [
    {
        'email': 'test1@email.com',
        'first_name': "John",
        'last_name': "Doe",
        'is_active': true
    },
    {
        'email': 'test2@email.com',
        'first_name': "Jane",
        'last_name': "Doe",
        'is_active': false
    },
    {
        'email': 'peter.dinklage@gmail.com',
        'first_name': "Peter",
        'last_name': "Dinklage",
        'is_active': false
    }
]


export function User() {
    return(
        <>
            <Header />
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
                        test_users.map(user => (
                            <tr key={user}>
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
            
        </>
    );
}