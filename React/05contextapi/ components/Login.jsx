import React from 'react';
import { useState,useContext } from "react"
import UserContext from '../context/UserContext';

function Login(props) {
    const [username,setuser] = useState("")
    const [pass,setPass] = useState("")

    const {setUser} = useContext(UserContext)
    const handleclick = (e)=>{
        e.preventDefault()
        setUser({username,pass})
        
    }
    return (
        <div>
            <input 
            placeholder='username:'
            value={username}
            onChange={(e) => setuser(e.target.value)}
            ></input>

            <input 
            placeholder='password:'
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            type='password'
            ></input>

            <button
             type='submit'
             onClick={handleclick}   
            >
                Submit 
            </button>
        </div>
    );
}

export default Login;