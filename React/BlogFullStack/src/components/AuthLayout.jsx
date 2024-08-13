//this component is use for authenticate the user wheather it is login or not
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Protected({ children, authentication = true }) {
    const navigate = useNavigate()
    const [loader, setLoder] = useState(true)
    const authStatus = useSelector((state) => state.auth.status)      //some time the auth.status not working put only state.status

    useEffect(() => {

        //simple logic is but in this you are not using the concept of the authentication it is impoartant we will see in feature 
        if (!authStatus) {
            navigate('/login')
        }
        else {
            navigate('/')
        }

        // if (authentication && authStatus !== authentication) {
        //     navigate('/login')
        // } else if (!authentication && authStatus !== authentication) {
        //     navigate('/')
        // }
        setLoder(false)
    }, [navigate, loader, authStatus])


    return loader ? <h1>Loading.....</h1> : children
}