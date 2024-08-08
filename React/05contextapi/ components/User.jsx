import React,{useContext} from 'react';
import UserContext from '../context/UserContext';
function User(props) {

    // Using the varibles that is define in the UserContextProvider and pass 
    const {user} = useContext(UserContext)
    return (
        <div>
            {user.username}
        </div>
    );
}

export default User;