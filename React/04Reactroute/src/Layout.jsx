// All the common element on the project
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { Outlet } from 'react-router-dom';  // this is handle by the react

function Layout(props) {
    return (
        <div>
            <Header/>
            {/* here the outlet changes according to link and the element is loaded  */}
            
            <Outlet/>
            <Footer/>
        </div>
    );
}

export default Layout;