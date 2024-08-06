import React from 'react';
import { useLoaderData } from 'react-router-dom';
function Github(props) {
    const user = useLoaderData()
    console.log(user.login)
    return (
        <div>
            <h1>UserName:{user.login}</h1>
        </div>
    );
}
export const Githubloader = async ()=>{
    const res = await fetch("https://api.github.com/users/shahviraj222")
    return res.json()
}
export default Github;