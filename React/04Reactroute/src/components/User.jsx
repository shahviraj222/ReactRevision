import React from 'react';
import { useParams } from 'react-router-dom';   // to take value of url 

function User(props) {
    const {userid} = useParams()
    return (
        <div>
            <span>User:{userid}</span>
        </div>
    );
}

export default User;