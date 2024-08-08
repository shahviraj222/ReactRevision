import React from 'react';
import UserContext from './UserContext';
import { useState } from 'react';

const UserContextProvider= ({children}) => {

    const [user,setUser] = useState("")
    return (

        // pass the varible which ever you want to share
        <UserContext.Provider value={{user , setUser}}>     
        {children}
       </UserContext.Provider>

    );
}

export default UserContextProvider;