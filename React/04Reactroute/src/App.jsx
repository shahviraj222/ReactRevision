import { useState } from 'react'
import {createBrowserRouter, createRoutesFromChildren, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom'
import Layout from './Layout'
import About from './components/About'
import Home from './components/Home'
import Contact from './components/Contact'

function App() {
  
  // this will handle all requests
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Layout/>}>

        {/* this all are the childe so  /about , /contact */}
        <Route path='' element={<Home/>}/>
        <Route path='about' element={<About/>}/>
        <Route path='contact' element={<Contact/>}/>
      </Route>
    )
  )
  return (
    <>
    {/* this tag is rendering in the index.js */}
    <RouterProvider router={router} />
    </>
  )
}

export default App
