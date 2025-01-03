// Card.jsx
import React from 'react';

export const Card = ({ className = '', ...props }) => {
    return (
        <div
            className={`rounded-lg border bg-white shadow-sm ${className}`}
            {...props}
        />
    );
};

export const CardHeader = ({ className = '', ...props }) => {
    return (
        <div
            className={`flex flex-col space-y-1.5 p-6 ${className}`}
            {...props}
        />
    );
};

export const CardTitle = ({ className = '', ...props }) => {
    return (
        <h3
            className={`font-semibold leading-none tracking-tight text-lg ${className}`}
            {...props}
        />
    );
};

export const CardContent = ({ className = '', ...props }) => {
    return (
        <div
            className={`p-6 pt-0 ${className}`}
            {...props}
        />
    );
};
