import React from 'react';
import { Link } from 'react-router-dom';

function Home(props) {
    return (
        <div className="bg-gray-100 flex items-center justify-center">
            <Link to="/" className="block bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-500 hover:scale-105 hover:shadow-2xl">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-800  mb-4">Viraj Shah Company</h1>
                    <div className="w-48 h-48 mx-auto mb-4 bg-gray-200 rounded-lg overflow-hidden">
                        <img 
                            src='https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg'
                            alt='Bird'
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam nulla consectetur quos fugiat minima porro provident commodi saepe, tempore ducimus laboriosam! Quam, blanditiis voluptatibus? Eos minus enim culpa deserunt pariatur?
                    </p>
                </div>
            </Link>
        </div>
    );
}

export default Home;