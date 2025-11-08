
import React, { useState, useEffect, Suspense, lazy, useRef } from 'react';
import { Result, Sector, UserData } from '../../types';
import * as HubSpot from '../../services/hubspot';
import Sidebar from './Sidebar';
import { IconBookOpen, IconRefresh } from '../common/Icon';
import ProgressiveForm from './common/ProgressiveForm';
import Spinner from '../common/Spinner';
import Feedback from '../common/Feedback';
import Confetti from '../common/Confetti';

// Lazy load sections for performance - CORRECTED and EXPANDED
const Section1_Comparison = lazy(() => import('./sections/Section1_Comparison'));
const Section2_Sizing = lazy(() => import('./sections/Section2_Sizing'));
const Section3_MarketIntelligence = lazy(() => import('./sections/Section3_MarketIntelligence'));
const Section4_Considerations = lazy(() => import('./sections/Section4_Considerations'));
const Section5_Process = lazy(() => import('./sections/Section5_Process'));
const Section6_FAQ = lazy(() => import('./sections/Section6_FAQ'));
const Section7_Summary = lazy(() => import('./sections/Section7_Summary'));


interface BuyersGuideProps {
    result: Result;
    sector: Sector;
    onReset: () => void;
}

export const GUIDE_SECTIONS = [
    { id: 1, title: 'LED vs. Projector', component: Section1_Comparison },
    { id: 2, title: 'Sizing & Placement', component: Section2_Sizing },
    { id: 3, title: 'Market Intelligence', component: Section3_MarketIntelligence },
    { id: 4, title: 'Sector-Specific Considerations', component: Section4_Considerations },
    { id: 5, title: 'Implementation Process', component: Section5_Process },
    { id: 6, title: 'Frequently Asked Questions', component: Section6_FAQ },
    { id: 7, title: 'Your Custom Summary', component: Section7_Summary },
];

const BuyersGuide: React.FC<BuyersGuideProps> = ({ result, sector, onReset }) => {
    const mainContentRef = useRef<HTMLElement>(null);
    const [activeSection, setActiveSection] = useState(1);
    const [animationDirection, setAnimationDirection] = useState<'next' | 'prev'>('next');
    const [completedSections, setCompletedSections] = useState<Set<number>>(new Set([1]));
    const [userData, setUserData] = useState(result.userData);
    const [showProgressiveForm, setShowProgressiveForm] = useState(false);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    const isProfileComplete = !!userData.email;
    const isLastSection = activeSection === GUIDE_SECTIONS.length;

     useEffect(() => {
        HubSpot.trackEvent(`Viewed Guide Section ${activeSection}`, HubSpot.getSessionUserId());
        
        if ((activeSection === 2 || activeSection === 3) && !isProfileComplete) {
            setShowProgressiveForm(true);
        }
        
        if (isLastSection) {
            HubSpot.trackEvent('Finished Buyer\'s Guide', HubSpot.getSessionUserId());
        }

    }, [activeSection, isProfileComplete, isLastSection]);
    
    // Effect for smooth scrolling
    useEffect(() => {
        if (mainContentRef.current) {
            mainContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [activeSection]);


    const handleSectionChange = (sectionId: number) => {
        if (sectionId === activeSection) return;

        if (sectionId > 0 && sectionId <= GUIDE_SECTIONS.length) {
             if ((sectionId > 1) && !isProfileComplete) {
                setShowProgressiveForm(true);
            } else {
                if (sectionId > activeSection) {
                    setAnimationDirection('next');
                } else {
                    setAnimationDirection('prev');
                }
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
    
    const currentResult = { ...result, userData };
    const ActiveComponent = GUIDE_SECTIONS.find(s => s.id === activeSection)?.component;

    return (
        <div className="animate-fade-in buyer-guide-container">
            {showProgressiveForm && (
                <ProgressiveForm
                    onSubmit={handleProgressiveFormSubmit}
                    onClose={() => setShowProgressiveForm(false)}
                />
            )}
            <div className="text-center mb-8">
                <IconBookOpen className="w-12 h-12 mx-auto text-church-primary dark:text-church-accent" />
                <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-800 dark:text-gray-100 mt-4">Your Interactive LED Buyer's Guide</h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Welcome, {userData.firstName || userData.fullName}! This guide is tailored to help you make the most informed decision for your {sector === 'church' ? 'House of Worship' : 'Venue'}.
                </p>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden mb-4 relative print-hide">
                <button
                    onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                    className="w-full flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow font-semibold text-gray-800 dark:text-gray-100"
                    aria-haspopup="true"
                    aria-expanded={isMobileNavOpen}
                >
                    <span>{GUIDE_SECTIONS.find(s => s.id === activeSection)?.title}</span>
                    <svg className={`w-5 h-5 transition-transform ${isMobileNavOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                {isMobileNavOpen && (
                    <nav className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 z-20 border dark:border-gray-700">
                        <ul>
                            {GUIDE_SECTIONS.map(section => (
                                <li key={section.id}>
                                    <button 
                                        onClick={() => { handleSectionChange(section.id); setIsMobileNavOpen(false); }}
                                        className={`w-full text-left p-3 rounded-md text-sm font-semibold ${activeSection === section.id ? 'bg-church-primary/10 text-church-primary dark:text-blue-300' : 'text-gray-600 dark:text-gray-300'}`}
                                    >
                                        {section.title}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                <aside className="md:w-1/4">
                    <Sidebar
                        activeSection={activeSection}
                        setActiveSection={handleSectionChange}
                        completedSections={completedSections}
                    />
                </aside>
                <main ref={mainContentRef} className="relative flex-1 bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-xl min-h-[60vh] flex flex-col overflow-hidden">
                   {isLastSection && <Confetti intensity="light" container="parent" />}
                   <div key={activeSection} className={`flex-grow flex flex-col ${animationDirection === 'next' ? 'animate-slide-in-from-right' : 'animate-slide-in-from-left'}`}>
                        <Suspense fallback={<div className="flex justify-center items-center h-64"><Spinner /></div>}>
                           {ActiveComponent && <ActiveComponent sector={sector} result={currentResult} />}
                        </Suspense>
                   </div>
                   {!isLastSection && (
                       <div className="mt-8 pt-6 border-t dark:border-gray-700 flex justify-between items-center print-hide">
                            <button 
                                onClick={() => handleSectionChange(activeSection - 1)} 
                                disabled={activeSection === 1}
                                className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
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
                 <button onClick={onReset} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 font-semibold flex items-center mx-auto transition-colors">
                    <IconRefresh className="mr-2"/>
                    Back to Start
                </button>
                <div className="max-w-md mx-auto mt-8">
                    <Feedback />
                </div>
            </div>
        </div>
    );
};

export default BuyersGuide;