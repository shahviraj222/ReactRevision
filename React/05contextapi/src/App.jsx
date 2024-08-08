import { useState } from 'react'
import Login from '../ components/Login'
import User from '../ components/User'
import UserContextProvider from '../context/UserContextProvider'
function App() {


  return (

    <UserContextProvider>
    <Login/>
    <User/>
    </UserContextProvider>
   
  )
}

export default App
