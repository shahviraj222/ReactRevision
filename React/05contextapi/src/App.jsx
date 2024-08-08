import { useState } from 'react'
import Login from '../ components/Login'
import User from '../ components/User'
import UserContextProvider from '../context/UserContextProvider'
import { ThemeProvider } from '../context/theme'
function App() {

  const themeMode=0
  return (

    <UserContextProvider>
      <ThemeProvider value={{themeMode}}>
        <Login />
        <User />
      </ThemeProvider>
    </UserContextProvider>

  )
}

export default App
