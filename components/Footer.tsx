import React from 'react';
import { TKCP_CONFIG } from '../constants';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 dark:bg-black text-white mt-auto transition-colors duration-300">
            <div className="container mx-auto px-4 py-6 text-center">
                <p>&copy; {new Date().getFullYear()} {TKCP_CONFIG.companyName}. All Rights Reserved.</p>
                <p className="text-sm text-gray-400 mt-2">Your Partner in Visual Excellence</p>
            </div>
        </footer>
    );
};

export default Footer;