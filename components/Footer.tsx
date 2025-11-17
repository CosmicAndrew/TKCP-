import React from 'react';
import { TKCP_CONFIG } from '../constants';

const Footer: React.FC = () => {
    const footerLinks = [
        { text: 'LED Video Walls', href: 'https://thykingdomcomeproductions.com' },
        { text: 'Church LED Displays', href: 'https://thykingdomcomeproductions.com/church-led-walls/' },
        { text: 'Testimonials', href: 'https://thykingdomcomeproductions.com/testimonials' },
        { text: 'Portfolio', href: 'https://thykingdomcomeproductions.com/portfolio' },
    ];

    return (
        <footer className="bg-gray-800 dark:bg-black text-white mt-auto transition-colors duration-300">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:text-left">
                    <div>
                        <h4 className="font-display text-xl font-bold">{TKCP_CONFIG.companyName}</h4>
                        <p className="text-sm text-gray-400 mt-2">Your Partner in Visual Excellence</p>
                        <p className="mt-2 font-semibold">
                            <a href={TKCP_CONFIG.phoneLink} className="hover:text-church-accent transition-colors">{TKCP_CONFIG.phone}</a>
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold uppercase tracking-wider text-sm text-gray-300">Quick Links</h4>
                        <ul className="mt-4 space-y-2">
                            {footerLinks.map(link => (
                                <li key={link.text}>
                                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-sm">{link.text}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-700 text-center text-xs text-gray-500">
                    <p>&copy; {new Date().getFullYear()} {TKCP_CONFIG.companyName}. All Rights Reserved. | <a href={TKCP_CONFIG.website} className="hover:underline">Main Site</a></p>
                    <p className="mt-2">
                        <a href="https://thykingdomcomeproductions.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="hover:underline">Privacy Policy</a>
                        <span className="mx-2">|</span>
                        <span>Assessment URL: <a href="https://assessment.thykingdomcomeproductions.com/" className="hover:underline">assessment.thykingdomcomeproductions.com</a></span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default React.memo(Footer);