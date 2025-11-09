import React from 'react';
import { TKCP_CONFIG } from '../constants';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 dark:bg-black text-white mt-auto transition-colors duration-300">
            <div className="container mx-auto px-4 py-6 text-center">
                <p>&copy; {new Date().getFullYear()} {TKCP_CONFIG.companyName}. All Rights Reserved.</p>
                <p className="text-sm text-gray-400 mt-2">Your Partner in Visual Excellence</p>
                <div className="mt-4">
                    <a href="https://thykingdomcomeproductions.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-gray-300 transition-colors underline">
                        Privacy Policy
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;