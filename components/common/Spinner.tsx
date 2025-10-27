
import React from 'react';

const Spinner: React.FC = () => {
    return (
        <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 rounded-full animate-pulse bg-church-primary"></div>
            <div className="w-4 h-4 rounded-full animate-pulse bg-church-primary [animation-delay:0.2s]"></div>
            <div className="w-4 h-4 rounded-full animate-pulse bg-church-primary [animation-delay:0.4s]"></div>
            <p className="ml-4 text-gray-600">Generating your insights...</p>
        </div>
    );
};

export default Spinner;
