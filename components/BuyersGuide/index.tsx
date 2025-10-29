import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Result, Sector, UserData } from '../../types';
import * as HubSpot from '../../services/hubspot';
import Sidebar from './Sidebar';
import { IconBookOpen, IconRefresh } from '../common/Icon';
import ProgressiveForm from './common/ProgressiveForm';
import Spinner from '../common/Spinner';

// Lazy load sections for performance
const Section1_Comparison = lazy(() => import('./sections/Section1_Comparison'));
const Section2_MarketIntelligence = lazy(() => import('./sections/Section2_MarketIntelligence'));
const Section3_Considerations = lazy(() => import('./sections/Section3_Considerations'));
const Section5_Investment = lazy(() => import('./sections/Section5_Investment'));
const Section6_Process = lazy(() => import('./sections/Section6_Process'));
const Section5_Summary = lazy(() => import('./sections/Section5_Summary'));


interface BuyersGuideProps {
    result: Result;
    sector: Sector;
    onReset: () => void;
}

export const GUIDE_SECTIONS = [
    { id: 1, title: 'LED vs. Projector', component: Section1_Comparison },
    { id: 2, title: 'Market Intelligence', component: Section2_MarketIntelligence },
    { id: 3, title: 'Sector-Specific Considerations', component: Section3_Considerations },
    { id: 4, title: 'Investment & Financing', component: Section5_Investment },
    { id: 5, title: 'Implementation Process', component: Section6_Process },
    { id: 6, title: 'Your Custom LED Summary', component: Section5_Summary },
];

const BuyersGuide: React.FC<BuyersGuideProps> = ({ result, sector, onReset }) => {
    const [activeSection, setActiveSection] = useState(1);
    const [completedSections, setCompletedSections] = useState<Set<number>>(new Set([1]));
    const [userData, setUserData] = useState(result.userData);
    const [showProgressiveForm, setShowProgressiveForm] = useState(false);

    const isProfileComplete = !!userData.email;

     useEffect(() => {
        HubSpot.trackEvent(`Viewed Guide Section ${activeSection}`, HubSpot.getSessionUserId());
        
        if ((activeSection === 2 || activeSection === 3) && !isProfileComplete) {
            setShowProgressiveForm(true);
        }
        
        if (activeSection === GUIDE_SECTIONS.length) {
            HubSpot.trackEvent('Finished Buyer\'s Guide', HubSpot.getSessionUserId());
        }

    }, [activeSection, isProfileComplete]);

    const handleSectionChange = (sectionId: number) => {
        if (sectionId > 0 && sectionId <= GUIDE_SECTIONS.length) {
             if ((sectionId > 1) && !isProfileComplete) {
                setShowProgressiveForm(true);
            } else {
                setActiveSection(sectionId);
                setCompletedSections(prev => new Set(prev).add(sectionId));
            }
        }
    };
    
    const handleProgressiveFormSubmit = (data: Partial<UserData>) => {
        const updatedUserData = { ...userData, ...data };
        setUserData(updatedUserData);
        HubSpot.upsertContact({
            session_user_id: HubSpot.getSessionUserId(),
            ...data
        });
        HubSpot.trackEvent('Progressive Form Submitted', HubSpot.getSessionUserId());
        setShowProgressiveForm(false);
        setCompletedSections(prev => new Set(prev).add(activeSection));
    };

    const ActiveComponent = GUIDE_SECTIONS.find(s => s.id === activeSection)?.component;
    const isLastSection = activeSection === GUIDE_SECTIONS.length;

    const currentResult = { ...result, userData };

    return (
        <div className="animate-fade-in buyer-guide-container">
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
                    Welcome, {userData.firstName || userData.fullName}! This guide is tailored to help you make the most informed decision for your {sector === 'church' ? 'House of Worship' : 'Venue'}.
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
                        <Suspense fallback={<div className="flex justify-center items-center h-64"><Spinner /></div>}>
                            {ActiveComponent && <ActiveComponent sector={sector} result={currentResult} />}
                        </Suspense>
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