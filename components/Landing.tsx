
import React from 'react';
import { Sector } from '../types';
import { IconArrowRight } from './common/Icon';

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
            className={`w-full text-left p-6 font-bold text-xl ${accentColor} ${textColor} flex justify-between items-center transition-opacity hover:opacity-80`}
        >
            I'm with a {sector === Sector.Church ? 'Church' : 'Venue'}
            <IconArrowRight />
        </button>
    </div>
);


const Landing: React.FC<LandingProps> = ({ onStart }) => {
    return (
        <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-display font-bold text-gray-800">Find Your Perfect Screen in 60 Seconds</h2>
            <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-600">
                Answer a few quick questions to get a personalized recommendation and discover the ROI of a zero-maintenance LED wall for your organization.
            </p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <SectorCard
                    sector={Sector.Church}
                    title="Stop projector problems forever."
                    subtitle="Save $8-10K annually with zero-maintenance LED. Crystal-clear from every seat."
                    bgColor="bg-church-primary"
                    accentColor="bg-church-accent"
                    textColor="text-white"
                    onSelect={() => onStart(Sector.Church)}
                />
                <SectorCard
                    sector={Sector.Hospitality}
                    title="Generate 30-40% more event revenue."
                    subtitle="Eliminate $30-60K in annual rentals. Payback within 12-18 months."
                    bgColor="bg-hospitality-primary"
                    accentColor="bg-hospitality-accent"
                    textColor="text-white"
                    onSelect={() => onStart(Sector.Hospitality)}
                />
            </div>
        </div>
    );
};

export default Landing;
