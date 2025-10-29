import React, { useState, useEffect } from 'react';
import { Result, Sector } from '../../types';
import Sidebar from './Sidebar';
import Section1_Comparison from './sections/Section1_Comparison';
import Section2_Sizing from './sections/Section2_Sizing';
import Section3_Considerations from './sections/Section3_Considerations';
import Section4_TechSpecs from './sections/Section4_TechSpecs';
import Section5_Investment from './sections/Section5_Investment';
import Section6_Process from './sections/Section6_Process';
import { IconBookOpen, IconRefresh } from '../common/Icon';

interface BuyersGuideProps {
    result: Result;
    sector: Sector;
    onReset: () => void;
}

export const GUIDE_SECTIONS = [
    { id: 1, title: 'LED vs. Projector', component: Section1_Comparison },
    { id: 2, title: 'Sizing & Configuration', component: Section2_Sizing },
    { id: 3, title: 'Sector-Specific Use Cases', component: Section3_Considerations },
    { id: 4, title: 'Technical Specifications', component: Section4_TechSpecs },
    { id: 5, title: 'Investment & Financing', component: Section5_Investment },
    { id: 6, title: 'Implementation Process', component: Section6_Process },
];

const BuyersGuide: React.FC<BuyersGuideProps> = ({ result, sector, onReset }) => {
    const [activeSection, setActiveSection] = useState(1);
    const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());

    useEffect(() => {
        const currentSet = new Set(completedSections);
        currentSet.add(activeSection);
        setCompletedSections(currentSet);
         // Simulate tracking event for HubSpot
        console.log(`Lead Nurturing Event: User viewed Section ${activeSection}`, { email: result.userData.email });
    }, [activeSection, result.userData.email]);

    const ActiveComponent = GUIDE_SECTIONS.find(s => s.id === activeSection)?.component;

    const handleNext = () => {
        if (activeSection < GUIDE_SECTIONS.length) {
            setActiveSection(prev => prev + 1);
        }
    };
    
    const handlePrev = () => {
        if (activeSection > 1) {
            setActiveSection(prev => prev - 1);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="text-center mb-8">
                <IconBookOpen className="w-12 h-12 mx-auto text-church-primary" />
                <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-800 mt-4">Your Interactive LED Buyer's Guide</h1>
                <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">
                    Welcome, {result.userData.firstName}! This guide is tailored to help you make the most informed decision for your {sector === 'church' ? 'House of Worship' : 'Venue'}.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                <aside className="md:w-1/4">
                    <Sidebar
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                        completedSections={completedSections}
                    />
                </aside>
                <main className="flex-1 bg-white p-6 md:p-8 rounded-lg shadow-xl min-h-[60vh]">
                   {ActiveComponent && <ActiveComponent sector={sector} />}
                   <div className="mt-8 pt-6 border-t flex justify-between items-center">
                        <button 
                            onClick={handlePrev} 
                            disabled={activeSection === 1}
                            className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        <button 
                            onClick={handleNext} 
                            disabled={activeSection === GUIDE_SECTIONS.length}
                            className="px-6 py-2 bg-church-primary text-white font-semibold rounded-md hover:bg-church-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next Section
                        </button>
                    </div>
                </main>
            </div>
             <div className="mt-12 text-center">
                 <button onClick={onReset} className="text-gray-500 hover:text-gray-800 font-semibold flex items-center mx-auto transition-colors">
                    <IconRefresh className="mr-2"/>
                    Back to Start
                </button>
            </div>
        </div>
    );
};

export default BuyersGuide;
