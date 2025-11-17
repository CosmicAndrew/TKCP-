import React, { useState, useEffect } from 'react';
import { Sector, Theme } from '../types';
import { IconArrowRight, IconChurch, IconBuildingOffice } from './common/Icon';

interface LandingProps {
    onSectorSelect: (sector: Sector) => void;
    theme: Theme;
}

const testimonials = [
    {
        quote: "TKCP replaced our 10-year-old projector. They worked late without complaints. Support has been top-notch.",
        author: "Grant Hill",
        org: "Church Client",
    },
    {
        quote: "Installed 3 LED video walls in our 3,500-seat sanctuary. Experience was fantastic—we recommend them to anyone.",
        author: "Brenden Burge",
        org: "Church Client",
    },
    {
        quote: "Thank you for being a blessing and using your gifts for God's Kingdom.",
        author: "Randy Adams",
        org: "Church Client",
    }
];

const Landing: React.FC<LandingProps> = ({ onSectorSelect, theme }) => {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
        }, 5000); // Change testimonial every 5 seconds
        return () => clearInterval(timer);
    }, []);

    const scrollToSelection = () => {
        document.getElementById('sector-selection')?.scrollIntoView({ behavior: 'smooth' });
    };

    const linkClass = "text-church-accent dark:text-yellow-300 underline hover:text-opacity-80";

    return (
        <div className="animate-fade-in space-y-16 md:space-y-24">
            {/* Hero Section */}
            <section className="text-center rounded-lg shadow-xl overflow-hidden min-h-[400px] md:min-h-[500px] flex items-center justify-center bg-church-primary relative">
                <div className="absolute inset-0 overflow-hidden">
                    <div className={`absolute inset-0 hero-bg-church-sanctuary transition-opacity duration-1000 ease-in-out ${theme === 'light' ? 'opacity-100' : 'opacity-0'}`} />
                    <div className={`absolute inset-0 hero-bg-modern-venue transition-opacity duration-1000 ease-in-out ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`} />
                    {/* Add a darkening overlay for better text contrast */}
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>
                <div className="relative z-10 text-white p-8 max-w-3xl">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold [text-shadow:_0_2px_4px_rgba(0,0,0,0.5)] animate-hero-text opacity-0">
                        Is an LED Screen Right for Your Organization?
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-gray-200 [text-shadow:_0_1px_3px_rgba(0,0,0,0.5)] animate-fade-in-up opacity-0" style={{ animationDelay: '0.9s' }}>
                        Stop guessing. In 90 seconds, our AI-powered assessment gives you a clear answer on whether high-impact <a href="https://thykingdomcomeproductions.com/church-led-walls/" target="_blank" rel="noopener noreferrer" className={linkClass}>LED walls</a> are a smart investment for you.
                    </p>
                    <button 
                        onClick={scrollToSelection}
                        aria-label="Take the LED assessment to see if it's right for you"
                        className="mt-8 px-8 py-3 bg-white text-church-primary font-bold rounded-md shadow-lg transition-transform hover:scale-105 animate-hero-cta opacity-0 animate-pulse-delayed relative overflow-hidden sparkle-button"
                    >
                        Start My Free Assessment &rarr;
                    </button>
                </div>
            </section>

            {/* Sector Selection Section */}
            <section id="sector-selection" className="animate-fade-in-up opacity-0" style={{ animationDelay: '500ms' }}>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-gray-800 dark:text-gray-100">
                    First, tell us about your organization.
                </h2>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* House of Worship Card */}
                    <div className="bg-church-primary text-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform hover:-translate-y-1">
                        <div className="p-8 flex-grow">
                            <IconChurch className="w-12 h-12 text-church-accent mb-4"/>
                            <h3 className="text-2xl font-display font-bold">For Houses of Worship</h3>
                            <p className="mt-4 text-gray-200">
                                Enhance your worship experience and create a distraction-free environment with zero-maintenance <a href="https://thykingdomcomeproductions.com/led-panels/" target="_blank" rel="noopener noreferrer" className={linkClass}>LED displays</a>.
                            </p>
                        </div>
                        <button 
                            onClick={() => onSectorSelect(Sector.Church)}
                            className="w-full flex items-center justify-between p-4 bg-church-accent text-gray-900 font-bold text-lg hover:bg-yellow-400 transition-colors"
                        >
                            <span>I'm with a House of Worship</span>
                            <IconArrowRight className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Venues & Businesses Card */}
                    <div className="bg-hospitality-primary text-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform hover:-translate-y-1">
                         <div className="p-8 flex-grow">
                            <IconBuildingOffice className="w-12 h-12 text-hospitality-accent mb-4"/>
                            <h3 className="text-2xl font-display font-bold">For Venues & Businesses</h3>
                            <p className="mt-4 text-gray-200">
                                Boost event revenue and gain a competitive edge by eliminating rental costs with permanent <a href="https://thykingdomcomeproductions.com" target="_blank" rel="noopener noreferrer" className={linkClass}>LED video walls</a>.
                            </p>
                        </div>
                        <button 
                            onClick={() => onSectorSelect(Sector.Hospitality)}
                            className="w-full flex items-center justify-between p-4 bg-hospitality-accent text-white font-bold text-lg hover:bg-orange-500 transition-colors"
                        >
                            <span>I'm with a Venue/Business</span>
                            <IconArrowRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </section>
            
            {/* Social Proof / Testimonials Section */}
            <section className="animate-fade-in-up" style={{ animationDelay: '700ms' }}>
                 <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-gray-800 dark:text-gray-100">
                    Trusted by 200+ Churches nationwide
                </h2>
                <div className="mt-8 max-w-3xl mx-auto text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-inner relative overflow-hidden">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className={`transition-opacity duration-500 ease-in-out absolute inset-0 p-8 flex flex-col justify-center items-center ${index === currentTestimonial ? 'opacity-100' : 'opacity-0'}`}>
                            <blockquote className="text-xl italic text-gray-700 dark:text-gray-300">
                                "{testimonial.quote}"
                            </blockquote>
                            <cite className="mt-4 not-italic font-bold text-gray-600 dark:text-gray-400">
                                — {testimonial.author}, {testimonial.org}
                            </cite>
                        </div>
                    ))}
                    <div className="h-32"></div> {/* Placeholder for sizing */}
                </div>
                 <div className="text-center mt-6">
                    <a href="https://thykingdomcomeproductions.com/testimonials" target="_blank" rel="noopener noreferrer" className="text-church-primary dark:text-church-accent font-semibold hover:underline">
                        Read More Testimonials &rarr;
                    </a>
                </div>
            </section>

        </div>
    );
};

export default Landing;