// Button.jsx
import React from 'react';

const Button = ({ children, className, onClick }) => {
    return (

        <button className="bg-white hover:bg-primary-100 text-gray-800 font-semibold py-2 px-4 border h-full  border-gray-400 rounded shadow-md ${className" onClick={onClick}>
            {children}
        </button>
    );
}

export default Button;