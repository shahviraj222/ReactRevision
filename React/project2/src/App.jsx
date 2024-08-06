import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Cardlist from './Cardlist'
import removecard from './Cardlist'
import './App.css'

function App() {

  return (
    <>
    <div className='bg-black border-2 border-white  text-white rounded-lg p-9' >
     <Cardlist ></Cardlist>
     </div>
    </>
  )
}

export default App
