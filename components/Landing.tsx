import React from 'react';
import { Sector } from '../types';
import { IconArrowRight } from './common/Icon';

interface LandingProps {
    onSectorSelect: (sector: Sector) => void;
}

const Landing: React.FC<LandingProps> = ({ onSectorSelect }) => {
    
    const scrollToSelection = () => {
        document.getElementById('sector-selection')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="animate-fade-in space-y-16 md:space-y-24">
            {/* Hero Section */}
            <section className="text-center rounded-lg shadow-xl overflow-hidden min-h-[400px] md:min-h-[500px] flex items-center justify-center bg-church-primary relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.3)_0%,_transparent_60%)]"></div>
                <div className="relative z-10 text-white p-8">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold [text-shadow:_0_2px_4px_rgba(0,0,0,0.5)] animate-hero-text opacity-0">
                        See the difference LED makes?
                    </h1>
                    <button 
                        onClick={scrollToSelection}
                        className="mt-8 px-8 py-3 bg-white text-church-primary font-bold rounded-md shadow-lg transition-transform hover:scale-105 animate-hero-cta opacity-0"
                    >
                        Take Assessment &rarr;
                    </button>
                </div>
            </section>

            {/* Sector Selection Section */}
            <section id="sector-selection" className="animate-fade-in-up opacity-0" style={{ animationDelay: '500ms' }}>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-gray-800">
                    First, tell us who you are.
                </h2>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* House of Worship Card */}
                    <div className="bg-church-primary text-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform hover:-translate-y-1">
                        <div className="p-8 flex-grow">
                            <h3 className="text-2xl font-display font-bold">For Houses of Worship</h3>
                            <p className="mt-4 text-gray-200">
                                Stop projector problems forever. Save $8-10K annually with zero-maintenance LED.
                            </p>
                        </div>
                        <button 
                            onClick={() => onSectorSelect(Sector.Church)}
                            className="w-full flex items-center justify-between p-4 bg-church-accent text-church-primary font-bold text-lg hover:bg-yellow-400 transition-colors"
                        >
                            <span>I'm with a House of Worship</span>
                            <IconArrowRight className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Venues & Businesses Card */}
                    <div className="bg-hospitality-primary text-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform hover:-translate-y-1">
                        <div className="p-8 flex-grow">
                            <h3 className="text-2xl font-display font-bold">For Venues & Businesses</h3>
                            <p className="mt-4 text-gray-200">
                                Generate 30-40% more event revenue. Eliminate $30-60K in annual rentals.
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
        </div>
    );
};

export default Landing;
