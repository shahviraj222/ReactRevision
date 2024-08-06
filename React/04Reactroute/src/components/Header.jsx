import React from 'react';
import { NavLink } from 'react-router-dom';

// don't use <a herf> because it will reload the entire page <Link> <Navlink>
function Header(props) {
    return (
        <div className="bg-gray-800">
            <nav className="flex justify-around p-4 shadow-lg">
                <NavLink 
                  to="/" 
                  className={({ isActive }) => 
                    isActive ? "text-orange-400 font-bold" : "text-gray-200 hover:text-orange-400 transition duration-300"
                  }
                >
                    <li className="list-none">Home</li>
                </NavLink>

                <NavLink 
                  to="/about" 
                  className={({ isActive }) => 
                    isActive ? "text-orange-400 font-bold" : "text-gray-200 hover:text-orange-400 transition duration-300"
                  }
                >
                    <li className="list-none">About</li>
                </NavLink>

                <NavLink 
                  to="/contact" 
                  className={({ isActive }) => 
                    isActive ? "text-orange-400 font-bold" : "text-gray-200 hover:text-orange-400 transition duration-300"
                  }
                >
                    <li className="list-none">Contact</li>
                </NavLink>
                <NavLink 
                  to="/github" 
                  className={({ isActive }) => 
                    isActive ? "text-orange-400 font-bold" : "text-gray-200 hover:text-orange-400 transition duration-300"
                  }
                >
                    <li className="list-none">github</li>
                </NavLink>
            </nav>
        </div>
    );
}

export default Header;