import React, { useState, useEffect } from 'react';
import { Result, Sector, UserData } from '../../types';
import Sidebar from './Sidebar';
import Section1_Comparison from './sections/Section1_Comparison';
import Section3_Considerations from './sections/Section3_Considerations';
import Section5_Investment from './sections/Section5_Investment';
import Section6_Process from './sections/Section6_Process';
import Section5_Summary from './sections/Section5_Summary';
import { IconBookOpen, IconRefresh } from '../common/Icon';
import ProgressiveForm from './common/ProgressiveForm';

interface BuyersGuideProps {
    result: Result;
    sector: Sector;
    onReset: () => void;
}

export const GUIDE_SECTIONS = [
    { id: 1, title: 'LED vs. Projector', component: Section1_Comparison },
    { id: 2, title: 'Church-Specific Considerations', component: Section3_Considerations },
    { id: 3, title: 'Investment & Financing', component: Section5_Investment },
    { id: 4, title: 'Implementation Process', component: Section6_Process },
    { id: 5, title: 'Your Custom LED Summary', component: Section5_Summary },
];

const BuyersGuide: React.FC<BuyersGuideProps> = ({ result, sector, onReset }) => {
    const [activeSection, setActiveSection] = useState(1);
    const [completedSections, setCompletedSections] = useState<Set<number>>(new Set([1]));
    const [isProfileComplete, setIsProfileComplete] = useState(!!result.userData.email);
    const [showProgressiveForm, setShowProgressiveForm] = useState(false);

     useEffect(() => {
        // Track section view in HubSpot
        console.log(`Lead Nurturing Event: User viewed Section ${activeSection}`, { email: result.userData.email });
        
        // Trigger progressive form on sections 2 or 3 if profile is not complete
        if ((activeSection === 2 || activeSection === 3) && !isProfileComplete) {
            setShowProgressiveForm(true);
        }

    }, [activeSection, isProfileComplete, result.userData.email]);

    const handleSectionChange = (sectionId: number) => {
        if ((sectionId === 2 || sectionId === 3) && !isProfileComplete) {
            setShowProgressiveForm(true);
        } else {
            setActiveSection(sectionId);
            setCompletedSections(prev => new Set(prev).add(sectionId));
        }
    };
    
    const handleProgressiveFormSubmit = (data: Partial<UserData>) => {
        // In a real app, you'd send this to your backend/HubSpot
        console.log("Progressive form submitted:", data);
        // Here we just update local state to unblock the UI
        setIsProfileComplete(true);
        setShowProgressiveForm(false);
        // We can now proceed to the section the user wanted to see
        setCompletedSections(prev => new Set(prev).add(activeSection));
    };

    const ActiveComponent = GUIDE_SECTIONS.find(s => s.id === activeSection)?.component;
    const isLastSection = activeSection === GUIDE_SECTIONS.length;

    return (
        <div className="animate-fade-in">
            {showProgressiveForm && (
                <ProgressiveForm
                    onSubmit={handleProgressiveFormSubmit}
                    onClose={() => setShowProgressiveForm(false)}
                />
            )}
            <div className="text-center mb-8">
                <IconBookOpen className="w-12 h-12 mx-auto text-church-primary" />
                <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-800 mt-4">Your Interactive LED Buyer's Guide</h1>
                <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">
                    Welcome, {result.userData.firstName || result.userData.fullName}! This guide is tailored to help you make the most informed decision for your {sector === 'church' ? 'House of Worship' : 'Venue'}.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                <aside className="md:w-1/4">
                    <Sidebar
                        activeSection={activeSection}
                        setActiveSection={handleSectionChange}
                        completedSections={completedSections}
                    />
                </aside>
                <main className="flex-1 bg-white p-6 md:p-8 rounded-lg shadow-xl min-h-[60vh] flex flex-col">
                   <div className="flex-grow">
                     {ActiveComponent && <ActiveComponent sector={sector} result={result} />}
                   </div>
                   {!isLastSection && (
                       <div className="mt-8 pt-6 border-t flex justify-between items-center print-hide">
                            <button 
                                onClick={() => handleSectionChange(activeSection - 1)} 
                                disabled={activeSection === 1}
                                className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>
                            <button 
                                onClick={() => handleSectionChange(activeSection + 1)} 
                                disabled={isLastSection}
                                className="px-6 py-2 bg-church-primary text-white font-semibold rounded-md hover:bg-church-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next Section
                            </button>
                        </div>
                    )}
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