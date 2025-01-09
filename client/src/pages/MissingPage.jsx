import React from 'react';
import { Link } from 'react-router-dom';

const MissingPage = () => {
    return (
        <div className="mt-16 flex flex-col items-center justify-center">
            <h1 className="font-bold text-5xl">404 Page Not Found</h1>
            <p className="text-2xl mt-20">Sorry, the page you are looking for does not exist.</p>
            <button className="mt-10 bg-blue-500 text-white p-4 rounded focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-opacity-50 hover:bg-blue-700 transition-colors duration-300">
                <Link to="/">Go back to home</Link>
            </button>
        </div>
    );
};

export default MissingPage;