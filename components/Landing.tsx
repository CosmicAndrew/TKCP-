import React, { useState, useEffect } from 'react';
import { Sector } from '../types';
import { IconArrowRight } from './common/Icon';
import { TKCP_CONFIG } from '../constants';

interface LandingProps {
    onStart: (sector: Sector) => void;
}

const SectorCard: React.FC<{
    sector: Sector;
    title: string;
    subtitle: string;
    bgColor: string;
    accentColor: string;
    textColor: string;
    onSelect: () => void;
}> = ({ sector, title, subtitle, bgColor, accentColor, textColor, onSelect }) => (
    <div className={`rounded-xl shadow-2xl overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ${bgColor}`}>
        <div className="p-8">
            <h3 className={`text-3xl font-display font-bold ${textColor}`}>{title}</h3>
            <p className={`mt-4 text-lg ${textColor} opacity-90`}>{subtitle}</p>
        </div>
        <button
            onClick={onSelect}
            aria-label={`Select ${sector === Sector.Church ? 'House of Worship' : 'Venue/Business'}`}
            className={`w-full text-left p-6 font-bold text-xl ${accentColor} ${textColor} flex justify-between items-center transition-opacity hover:opacity-80`}
        >
            I'm with a {sector === Sector.Church ? 'House of Worship' : 'Venue/Business'}
            <IconArrowRight />
        </button>
    </div>
);

const Landing: React.FC<LandingProps> = ({ onStart }) => {
    const [animationStep, setAnimationStep] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setAnimationStep(1), 500),   // flicker ends, glitch starts
            setTimeout(() => setAnimationStep(2), 1200),  // glitch ends, burst starts
            setTimeout(() => setAnimationStep(3), 1500),  // burst ends, text appears
            setTimeout(() => setAnimationStep(4), 2500),  // CTA appears
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    const handleTakeAssessmentClick = () => {
        document.getElementById('sector-selection')?.scrollIntoView({ behavior: 'smooth' });
    };

    const churchColors = TKCP_CONFIG.colors;
    const burstStyle = {
        background: `radial-gradient(circle, ${churchColors.churchAccent} 0%, ${churchColors.churchPrimary} 70%)`
    };

    return (
        <div>
            <div className="text-center relative bg-black rounded-lg shadow-2xl overflow-hidden min-h-[60vh] flex flex-col items-center justify-center p-4">
                {/* Dim church interior with flickering projector */}
                <div className={`absolute inset-0 bg-gray-800 transition-opacity duration-500 ${animationStep >= 2 ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="absolute inset-0 bg-black opacity-60"></div>
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-gray-400 rounded-lg animate-flicker ${animationStep >= 1 ? 'animate-glitch' : ''}`}></div>
                </div>

                {/* LED screen BURST */}
                <div className={`absolute inset-0 ${animationStep >= 2 ? 'animate-burst' : 'opacity-0'}`} style={burstStyle}></div>

                {/* Animated Text and CTA */}
                <div className="relative z-10">
                    <h2 className={`text-4xl md:text-6xl font-display font-bold text-white opacity-0 ${animationStep >= 3 ? 'animate-hero-text' : ''}`}>
                        See the difference LED makes?
                    </h2>
                    <button
                        onClick={handleTakeAssessmentClick}
                        className={`mt-8 px-8 py-4 bg-white font-bold text-lg rounded-lg shadow-lg text-church-primary hover:bg-neutral-light transition-transform hover:scale-105 opacity-0 ${animationStep >= 4 ? 'animate-hero-cta' : ''}`}
                    >
                        Take Assessment <span aria-hidden="true">→</span>
                    </button>
                </div>
            </div>

            <div id="sector-selection" className="mt-16 pt-8">
                <h2 className="text-center text-4xl font-display font-bold text-gray-800">First, tell us who you are.</h2>
                 <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    <SectorCard
                        sector={Sector.Church}
                        title="For Houses of Worship"
                        subtitle="Stop projector problems forever. Save $8-10K annually with zero-maintenance LED."
                        bgColor="bg-church-primary"
                        accentColor="bg-church-accent"
                        textColor="text-white"
                        onSelect={() => onStart(Sector.Church)}
                    />
                    <SectorCard
                        sector={Sector.Hospitality}
                        title="For Venues & Businesses"
                        subtitle="Generate 30-40% more event revenue. Eliminate $30-60K in annual rentals."
                        bgColor="bg-hospitality-primary"
                        accentColor="bg-hospitality-accent"
                        textColor="text-white"
                        onSelect={() => onStart(Sector.Hospitality)}
                    />
                </div>
            </div>
        </div>
    );
};

export default Landing;
