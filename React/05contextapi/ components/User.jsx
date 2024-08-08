import React, { useContext } from 'react';
import UserContext from '../context/UserContext';
import useTheme from '../context/theme';
function User(props) {

    // Using the varibles that is define in the UserContextProvider and pass 
    const { user } = useContext(UserContext)
    const {themeMode} = useTheme()

    if(!user.username) return  <><h1>UserName: Null</h1> <h1>Theme Variable:{themeMode}</h1></>

    return (
        <div>
            <h1>Username:{user.username}</h1>
            <h1>Theme Variable:{themeMode}</h1>
        </div>
    );
}

export default User;