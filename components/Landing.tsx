import React from 'react';
import { Sector, Theme } from '../types';
import { IconArrowRight, IconChurchBuilding, IconHotel } from './common/Icon';

interface LandingProps {
    onSectorSelect: (sector: Sector) => void;
    theme: Theme;
}

const Landing: React.FC<LandingProps> = ({ onSectorSelect, theme }) => {
    
    const scrollToSelection = () => {
        document.getElementById('sector-selection')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="animate-fade-in space-y-16 md:space-y-24">
            {/* Hero Section */}
            <section className="text-center rounded-lg shadow-xl overflow-hidden min-h-[400px] md:min-h-[500px] flex items-center justify-center bg-church-primary relative">
                <div className="absolute inset-0 overflow-hidden">
                    <div className={`absolute inset-0 hero-bg-church-sanctuary transition-opacity duration-1000 ease-in-out ${theme === 'light' ? 'opacity-100' : 'opacity-0'}`} />
                    <div className={`absolute inset-0 hero-bg-modern-venue transition-opacity duration-1000 ease-in-out ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`} />
                </div>
                <div className="relative z-10 text-white p-8">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold [text-shadow:_0_2px_4px_rgba(0,0,0,0.5)] animate-hero-text opacity-0">
                        Find Your Perfect <a href="https://thykingdomcomeproductions.com/" className="underline hover:text-church-accent transition">LED Video Wall</a> & Elevate Your Space in 60 Seconds
                    </h1>
                    <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto [text-shadow:_0_1px_3px_rgba(0,0,0,0.6)] animate-hero-text opacity-0" style={{ animationDelay: '0.9s' }}>
                        Our 60-second assessment helps you discover the ideal <a href="https://thykingdomcomeproductions.com/led-display-solutions/" className="underline hover:text-church-accent transition">LED display</a> solution to inspire your audience. Get instant, AI-powered recommendations from TKCP.
                    </p>
                    <button 
                        onClick={scrollToSelection}
                        aria-label="Take the LED assessment to find your perfect LED video wall"
                        className="mt-8 px-8 py-3 bg-white text-church-primary font-bold rounded-md shadow-lg transition-transform hover:scale-105 animate-hero-cta opacity-0 animate-pulse-delayed relative overflow-hidden sparkle-button"
                    >
                        Take the Assessment
                    </button>
                     <p className="mt-4 text-sm text-gray-200 animate-hero-cta opacity-0" style={{ animationDelay: '1.4s' }}>
                        Trusted by 200+ <a href="https://thykingdomcomeproductions.com/testimonials/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">churches nationwide</a>
                    </p>
                </div>
            </section>

            {/* Sector Selection Section */}
            <section id="sector-selection" className="animate-fade-in-up opacity-0" style={{ animationDelay: '500ms' }}>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-gray-800 dark:text-gray-100">
                    First, tell us who you are.
                </h2>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* House of Worship Card */}
                    <div className="bg-church-primary text-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform hover:-translate-y-1">
                        <div className="p-8 flex-grow">
                            <div className="flex items-center gap-4">
                                <IconChurchBuilding className="w-10 h-10 text-church-accent"/>
                                <h3 className="text-2xl font-display font-bold">Churches & Ministries</h3>
                            </div>
                            <ul className="mt-4 space-y-2 list-disc list-inside text-gray-200">
                                <li>Zero-maintenance <a href="https://thykingdomcomeproductions.com/church-led-walls/" className="underline hover:text-white">LED walls</a></li>
                                <li>Crystal-clear worship visuals from every seat</li>
                                <li>Save $8-10K annually on maintenance</li>
                            </ul>
                        </div>
                        <button 
                            onClick={() => onSectorSelect(Sector.Church)}
                            className="w-full flex items-center justify-between p-4 bg-church-accent text-gray-900 font-bold text-lg hover:bg-yellow-400 transition-colors"
                        >
                            <span>Select Church</span>
                            <IconArrowRight className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Venues & Businesses Card */}
                    <div className="bg-hospitality-primary text-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform hover:-translate-y-1">
                        <div className="p-8 flex-grow">
                             <div className="flex items-center gap-4">
                                <IconHotel className="w-10 h-10 text-hospitality-accent"/>
                                <h3 className="text-2xl font-display font-bold">Hotels & Event Venues</h3>
                            </div>
                            <ul className="mt-4 space-y-2 list-disc list-inside text-gray-200">
                                <li>Generate 30-40% more venue revenue</li>
                                <li>Eliminate $30-60K annual AV rental costs</li>
                                <li>Attract premium bookings with permanent <a href="https://thykingdomcomeproductions.com/" className="underline hover:text-white">LED video walls</a></li>
                            </ul>
                        </div>
                        <button 
                            onClick={() => onSectorSelect(Sector.Hospitality)}
                            className="w-full flex items-center justify-between p-4 bg-hospitality-accent text-white font-bold text-lg hover:bg-orange-500 transition-colors"
                        >
                            <span>Select Hospitality</span>
                            <IconArrowRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </section>
            
            {/* Social Proof Section */}
            <section className="animate-fade-in-up opacity-0" style={{ animationDelay: '700ms' }}>
                 <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-gray-800 dark:text-gray-100">
                    <a href="https://thykingdomcomeproductions.com/testimonials/" target="_blank" rel="noopener noreferrer" className="hover:text-church-primary transition">Trusted by 200+ Churches & Venues Nationwide</a>
                </h2>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <blockquote className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <p className="text-gray-600 dark:text-gray-300 italic">"TKCP replaced our 10-year-old projector. They worked late without complaints. Support has been top-notch."</p>
                        <cite className="block mt-4 font-semibold text-gray-700 dark:text-gray-200">- Grant Hill, <a href="https://thykingdomcomeproductions.com/testimonials/" target="_blank" rel="noopener noreferrer" className="text-church-primary underline">Google Reviews</a></cite>
                    </blockquote>
                     <blockquote className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <p className="text-gray-600 dark:text-gray-300 italic">"Installed 3 <a href="https://thykingdomcomeproductions.com/" className="text-church-primary underline">LED video walls</a> in our 3,500-seat sanctuary. Experience was fantastic—we recommend them to anyone."</p>
                        <cite className="block mt-4 font-semibold text-gray-700 dark:text-gray-200">- Brenden Burge, <a href="https://thykingdomcomeproductions.com/testimonials/" target="_blank" rel="noopener noreferrer" className="text-church-primary underline">Google Reviews</a></cite>
                    </blockquote>
                     <blockquote className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <p className="text-gray-600 dark:text-gray-300 italic">"Thank you for being a blessing and using your gifts for God's Kingdom."</p>
                        <cite className="block mt-4 font-semibold text-gray-700 dark:text-gray-200">- Randy Adams, <a href="https://thykingdomcomeproductions.com/testimonials/" target="_blank" rel="noopener noreferrer" className="text-church-primary underline">Parkside Christian, OH</a></cite>
                    </blockquote>
                </div>
                <div className="mt-8 text-center">
                     <a href="https://thykingdomcomeproductions.com/testimonials/" target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-3 bg-church-primary text-white font-bold rounded-md shadow-lg transition-transform hover:scale-105">
                        See More Success Stories
                    </a>
                </div>
            </section>
        </div>
    );
};

export default Landing;
