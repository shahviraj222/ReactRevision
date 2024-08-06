import { useState } from 'react'
import Menu from './Menu'


function App() {

  let [color,setColor]=useState("Orange")

  const col=["Green" ,"Yellow","Orange","purple"]
  return (

    <>
      <Menu color={col} ></Menu>
    </>
  )
}

export default App
