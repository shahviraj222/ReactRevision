import { useState } from 'react'
import {createBrowserRouter, createRoutesFromChildren, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom'
import Layout from './Layout'
import About from './components/About'
import Home from './components/Home'
import Contact from './components/Contact'
import User from './components/User'
import Github from './components/Github'
import {Githubloader} from './components/Github'

{/* <Route path='user/:userid' element={<User/>}/>  if you don't provide the id then this give error*/}

function App() {
  
  // this will handle all requests
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Layout/>}>

        {/* this all are the childe so  /about , /contact */}
        <Route path='' element={<Home/>}/>
        <Route path='about' element={<About/>}/>
        <Route path='contact' element={<Contact/>}/>
        <Route path='user/:userid' element={<User/>}/>       
        <Route
        loader={Githubloader} 
        path='github' 
        element={<Github/>}
        />
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
