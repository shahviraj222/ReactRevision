import React from 'react';

function About(props) {
    return (
        <div className="bg-gray-100 py-10 px-6">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">About Us</h1>
                    <p className="text-gray-600 leading-relaxed mb-6">
                        Welcome to Viraj Shah Company! We are committed to delivering high-quality services and products that meet the needs of our diverse client base. Our team of professionals works diligently to ensure customer satisfaction at every level.
                    </p>
                    <p className="text-gray-600 leading-relaxed mb-6">
                        Our mission is to create value and make a difference in the lives of our customers, partners, and communities. We believe in innovation, integrity, and excellence, and these core values guide everything we do.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        Thank you for choosing us as your trusted partner. We look forward to building a lasting relationship with you and contributing to your success.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default About;