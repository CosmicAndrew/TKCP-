import React, { useState } from 'react';
import { TKCP_CONFIG } from '../constants';
import { IconFacebook, IconInstagram, IconLinkedIn, IconChevronDown } from './common/Icon';

const Footer: React.FC = () => {
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);

    const footerLinks = {
        "Company": [
            { text: "Home", href: "https://thykingdomcomeproductions.com/" },
            { text: "About Us", href: "https://thykingdomcomeproductions.com/about-us/" },
            { text: "Testimonials", href: "https://thykingdomcomeproductions.com/testimonials/" },
            { text: "Contact", href: "https://thykingdomcomeproductions.com/contact/" },
        ],
        "Solutions": [
            { text: "Church LED Walls", href: "https://thykingdomcomeproductions.com/church-led-walls/" },
            { text: "Event LED Displays", href: "https://thykingdomcomeproductions.com/events-productions-led-solutions/" },
            { text: "Our Process", href: "https://thykingdomcomeproductions.com/services/" },
            { text: "Privacy Policy", href: "https://thykingdomcomeproductions.com/privacy-policy/" },
        ]
    };

    const socialLinks = [
        { name: 'LinkedIn', href: 'https://www.linkedin.com/in/jasmineford/', icon: <IconLinkedIn /> },
        { name: 'Instagram', href: 'https://www.instagram.com/thykingdomcome_ledvideowalls/', icon: <IconInstagram /> },
        { name: 'Facebook', href: 'https://www.facebook.com/TKCLEDVideoWalls', icon: <IconFacebook /> },
    ];

    const toggleAccordion = (title: string) => {
        setOpenAccordion(prev => (prev === title ? null : title));
    };

    return (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto transition-colors duration-300">
            <div className="container mx-auto px-4 py-8">
                {/* Top section with info and links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Column 1: Company Info */}
                    <div className="space-y-4">
                        <h4 className="font-display text-xl font-bold text-gray-800 dark:text-white">{TKCP_CONFIG.companyName}</h4>
                        <p className="text-gray-500 dark:text-gray-400">Illuminating spaces for God's glory with Christ-centered excellence.</p>
                         <blockquote className="my-4 p-4 italic text-lg font-medium leading-relaxed text-green-700 dark:text-green-300 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
                            "Let your light shine before others, that they may see your good deeds and glorify your Father in heaven."
                            <cite className="block text-right mt-2 not-italic text-sm text-green-600 dark:text-green-400">— Matthew 5:16</cite>
                        </blockquote>
                    </div>
                    
                    {/* Column 2 & 3: Links (Accordion on mobile) */}
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {Object.entries(footerLinks).map(([title, links]) => {
                            const isOpen = openAccordion === title;
                            const panelId = `footer-panel-${title.replace(/\s+/g, '-')}`;
                            return (
                                <div key={title} className="border-b dark:border-gray-700 md:border-none">
                                    {/* Mobile Accordion Button */}
                                    <button
                                        className="md:hidden w-full flex justify-between items-center py-3 text-left"
                                        onClick={() => toggleAccordion(title)}
                                        aria-expanded={isOpen}
                                        aria-controls={panelId}
                                    >
                                        <h5 className="font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider text-sm">{title}</h5>
                                        <IconChevronDown className={`w-5 h-5 text-gray-500 dark:text-gray-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {/* Desktop Title */}
                                    <h5 className="hidden md:block font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider text-sm mb-4">{title}</h5>
                                    
                                    {/* Collapsible Panel */}
                                    <div
                                        id={panelId}
                                        role="region"
                                        className={`overflow-hidden transition-[max-height] duration-300 ease-in-out md:max-h-none ${isOpen ? 'max-h-64' : 'max-h-0'}`}
                                    >
                                        <ul className="space-y-3 pt-2 pb-4 md:p-0">
                                            {links.map(link => (
                                                <li key={link.text}>
                                                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-church-primary dark:hover:text-church-accent transition-colors duration-200">
                                                        {link.text}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Bottom section with copyright and socials */}
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-center sm:text-left text-sm text-gray-500 dark:text-gray-400">
                        &copy; {new Date().getFullYear()} {TKCP_CONFIG.companyName} | <a href={TKCP_CONFIG.phoneLink} className="hover:text-church-primary dark:hover:text-church-accent transition-colors">{TKCP_CONFIG.phone}</a>
                    </div>
                    <div className="flex items-center gap-4">
                        {socialLinks.map(link => (
                            <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`Follow us on ${link.name}`} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                                {React.cloneElement(link.icon, { className: 'w-5 h-5' })}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default React.memo(Footer);