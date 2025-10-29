import React, { useState } from 'react';
import { Sector, Result } from '../../../types';
import InfoCard from '../common/InfoCard';
import CalendarCTA from '../common/CalendarCTA';
import { IconCheckCircle, IconDollarSign } from '../../common/Icon';


interface SectionProps {
  sector: Sector;
  result: Result;
}

const Section1_Comparison: React.FC<SectionProps> = ({ sector }) => {
    const [projectorCost, setProjectorCost] = useState(5000);
    const ledCost = projectorCost * 0.3; // Simplified calculation for demonstration

    return (
        <div className="animate-fade-in-up">
            <h2 className="text-3xl font-display font-bold text-gray-800">1. LED vs. Projector Comparison</h2>
            <p className="mt-2 text-gray-600">Understand the fundamental differences and why leading organizations are making the switch.</p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoCard
                    icon={<IconCheckCircle />}
                    title="Average Lifespan"
                    value="100,000 Hours"
                    description="LEDs last over 11 years with constant use, compared to 2,000-5,000 hours for projector bulbs."
                    color="blue"
                />
                 <InfoCard
                    icon={<IconCheckCircle />}
                    title="Uptime / Reliability"
                    value="99.9%+"
                    description="No bulbs to fail, no color degradation. LED is a zero-maintenance, 'it just works' solution."
                    color="blue"
                />
                 <InfoCard
                    icon={<IconCheckCircle />}
                    title="Image Quality"
                    value="4K+ True Color"
                    description="Unaffected by ambient light, delivering vibrant, consistent colors and deep blacks from every seat."
                    color="yellow"
                />
                 <InfoCard
                    icon={<IconDollarSign />}
                    title="Total Cost of Ownership"
                    value="~70% Lower"
                    description="Eliminate costs from bulb replacements, labor, and emergency repairs over 5 years."
                    color="yellow"
                />
            </div>
            
            <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
                <h3 className="text-xl font-bold font-display text-gray-700">5-Year Maintenance Cost Calculator</h3>
                <p className="text-sm text-gray-600 mb-4">Estimate the savings by eliminating projector maintenance.</p>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1 w-full">
                        <label htmlFor="projector-cost" className="block text-sm font-medium text-gray-700">Annual Projector Maintenance ($)</label>
                        <input
                            id="projector-cost"
                            type="range"
                            min="500"
                            max="15000"
                            step="500"
                            value={projectorCost}
                            onChange={(e) => setProjectorCost(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-church-primary"
                        />
                         <div className="flex justify-between text-xs text-gray-500">
                            <span>$500</span>
                            <span>$15,000</span>
                        </div>
                    </div>
                    <div className="text-center p-4 rounded-md bg-white shadow-inner">
                        <p className="text-gray-600">Projector 5-Yr Cost:</p>
                        <p className="text-2xl font-bold text-red-500">${(projectorCost * 5).toLocaleString()}</p>
                        <p className="text-gray-600 mt-2">Est. LED 5-Yr Cost:</p>
                        <p className="text-2xl font-bold text-green-600">${(ledCost * 5).toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <CalendarCTA
                headline="🗓️ Ready to See Your Perfect Solution?"
                buttonText="Schedule Free Consultation"
            />
        </div>
    );
};

export default Section1_Comparison;