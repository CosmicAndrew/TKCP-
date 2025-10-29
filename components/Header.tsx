import React from 'react';
import { TKCP_CONFIG } from '../constants';

const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <a href={TKCP_CONFIG.website} target="_blank" rel="noopener noreferrer" className="text-2xl md:text-3xl font-display font-bold text-church-primary">
                    {TKCP_CONFIG.companyName}
                </a>
                <a href={TKCP_CONFIG.phoneLink} className="hidden sm:inline-block text-sm font-bold text-church-primary hover:text-church-accent transition-colors">
                    {TKCP_CONFIG.phone}
                </a>
            </div>
        </header>
    );
};

export default Header;