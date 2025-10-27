
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl md:text-3xl font-display font-bold text-church-primary">
                    Thy Kingdom Come Productions
                </h1>
                <a href="tel:+14698409808" className="hidden sm:inline-block text-sm font-bold text-church-primary hover:text-church-accent transition-colors">
                    (469) 840-9808
                </a>
            </div>
        </header>
    );
};

export default Header;
