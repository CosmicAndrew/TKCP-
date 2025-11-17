import React, { useState } from 'react';
import { Sector, Result } from '../../../types';
import InfoCard from '../common/InfoCard';
import CalendarCTA from '../common/CalendarCTA';
import { IconCheckCircle, IconDollarSign } from '../../common/Icon';

const KeywordLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-church-primary dark:text-church-accent underline hover:text-opacity-80 transition-colors duration-300">
        {children}
    </a>
);

interface SectionProps {
  sector: Sector;
  result: Result;
}

const Section1_Comparison: React.FC<SectionProps> = ({ sector }) => {
    const [projectorCost, setProjectorCost] = useState(8000);
    const ledCost = 0; // LED maintenance cost is effectively zero for 5 years.

    return (
        <div className="animate-fade-in-up">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-800 dark:text-gray-100">1. LED vs. Projector Comparison</h2>
            {/* FIX: The KeywordLink component was missing its children prop, causing a compilation error. I have added "LED video walls" as the child content for the link. */}
            <p className="mt-2 text-gray-600 dark:text-gray-300">Understand the fundamental differences and why leading organizations are making the switch to <KeywordLink href="https://thykingdomcomeproductions.com">LED video walls</KeywordLink>.</p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoCard
                    icon={<IconCheckCircle />}
                    title="Average Lifespan"
                    value="100,000+ Hours"
                    description="LEDs last over 11 years with constant use, compared to 2,000-3,000 hours for projector lamps."
                    color="blue"
                />
                 <InfoCard
                    icon={<IconCheckCircle />}
                    title="Installation Disruption"
                    value="1-3 Days"
                    description="Our efficient installations occur during the week, ensuring zero disruption to your Sunday services or weekend events."
                    color="blue"
                />
                 <InfoCard
                    icon={<IconCheckCircle />}
                    title="Venue Revenue (Hospitality)"
                    value="30-40% Increase"
                    // FIX: The KeywordLink component inside the description was missing its children prop. I have added "LED panel" as the child content.
                    description={<span>Gain a competitive edge, command premium prices, and eliminate <KeywordLink href="https://thykingdomcomeproductions.com/led-panels/">LED panel</KeywordLink> rental costs.</span>}
                    color="yellow"
                />
                 <InfoCard
                    icon={<IconDollarSign />}
                    title="Total Cost of Ownership"
                    value="~70% Lower"
                    description="Eliminate $8-10K annually in bulb replacements, labor, and emergency repairs over 5 years."
                    color="yellow"
                />
            </div>
            
            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-700">
                <h3 className="text-xl font-bold font-display text-gray-700 dark:text-gray-200">5-Year Maintenance Cost Calculator</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Estimate the savings by eliminating projector maintenance.</p>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1 w-full">
                        <label htmlFor="projector-cost" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Annual Projector Maintenance ($)</label>
                        <input
                            id="projector-cost"
                            type="range"
                            min="2000"
                            max="15000"
                            step="500"
                            value={projectorCost}
                            onChange={(e) => setProjectorCost(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-church-primary dark:bg-gray-600"
                        />
                         <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>$2,000</span>
                            <span>$15,000</span>
                        </div>
                    </div>
                    <div className="text-center p-4 rounded-md bg-white dark:bg-gray-800 shadow-inner">
                        <p className="text-gray-600 dark:text-gray-300">Projector 5-Yr Cost:</p>
                        <p className="text-2xl font-bold text-red-500">${(projectorCost * 5).toLocaleString()}</p>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">Est. LED 5-Yr Cost:</p>
                        <p className="text-2xl font-bold text-green-600">${(ledCost * 5).toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <CalendarCTA
                headline="🗓️ Ready to See Your Perfect Solution?"
                buttonText="Schedule Free Consultation"
                meetingType="discovery"
            />
        </div>
    );
};

export default Section1_Comparison;