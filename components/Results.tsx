import React, { useState, useEffect } from 'react';
import { ResultPageProps } from '../types';
import { IconBookOpen, IconRefresh, IconShare, IconCheckCircle, IconCalendar } from './common/Icon';
import ShareModal from './common/ShareModal';
import CategoryScoreBreakdown from './common/CategoryScoreBreakdown';
import * as HubSpot from '../services/hubspot';
import { HUBSPOT_CONFIG } from '../constants';
import { trackMetaEvent } from '../services/tracking';

const applications = {
    church: [
        "Worship services - Song lyrics, sermon notes, scripture",
        "Live-streaming - Broadcast-quality online services",
        "Youth ministry - Gaming, movies, interactive content",
        "Special services - Christmas, Easter, baptisms, weddings",
        "Fellowship - Photo slideshows, community updates",
    ],
    hospitality: [
        "Corporate events - Presentations, keynotes, branding",
        "Weddings - Custom monograms, photo slideshows",
        "Trade shows - Booth displays, product demos",
        "Hotel lobbies - Brand messaging, local attractions",
        "Conference centers - Multi-room event displays",
    ]
};

const WarmLeadResult: React.FC<ResultPageProps> = ({ result, onReset, sector, onNavigateToGuide }) => {
    const { userData, score, maxScore, geminiInsights } = result;
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const linkClass = "text-church-primary dark:text-church-accent underline hover:text-opacity-80";
    const [countdown, setCountdown] = useState(5);
    const [skipAutoRedirect, setSkipAutoRedirect] = useState(false);

    useEffect(() => {
        if (skipAutoRedirect || countdown <= 0) {
            return;
        }

        const timer = setTimeout(() => {
            setCountdown(prev => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [countdown, skipAutoRedirect]);

    useEffect(() => {
        if (countdown === 0 && !skipAutoRedirect) {
            onNavigateToGuide();
        }
    }, [countdown, skipAutoRedirect, onNavigateToGuide]);

    const handleBookMeeting = () => {
        HubSpot.trackEvent('Calendar Booking Attempted', HubSpot.getSessionUserId(), { meeting_type: 'discovery' });
        trackMetaEvent('Schedule', { content_type: 'consultation_booking_warm' });
        
        const url = new URL(HUBSPOT_CONFIG.meetingLinks.discovery);
        if (result.userData.firstName) url.searchParams.append('firstname', result.userData.firstName);
        if (result.userData.lastName) url.searchParams.append('lastname', result.userData.lastName);
        if (result.userData.email) url.searchParams.append('email', result.userData.email);
        
        url.searchParams.append('utm_source', 'assessment');
        url.searchParams.append('utm_medium', 'results_warm');
        url.searchParams.append('utm_campaign', 'q4_led_screens');

        window.open(url.toString(), '_blank');
    };

    return (
        <>
            <div className="max-w-4xl mx-auto animate-fade-in">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 md:p-10">
                    <div className="text-5xl mb-4 animate-bounce-in">💡</div>
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-800 dark:text-gray-100">
                        Explore <a href="https://thykingdomcomeproductions.com/church-led-walls/" target="_blank" rel="noopener noreferrer" className={linkClass}>LED Wall</a> Solutions for Your Space
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                        Thanks, {userData.firstName || 'Friend'}! Your score of <strong>{score}/{maxScore}</strong> shows you're actively planning. Here's how an LED upgrade could benefit you.
                    </p>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                             {geminiInsights && (
                                <div className="text-left bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg border dark:border-gray-700 h-full flex flex-col">
                                    <h3 className="text-xl font-display font-bold text-gray-800 dark:text-gray-100 mb-2">
                                        AI-Powered Insights
                                    </h3>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">{geminiInsights.summary}</p>
                                </div>
                            )}
                        </div>
                        <CategoryScoreBreakdown result={result} />
                    </div>

                    <div className="mt-8">
                        <h3 className="text-2xl font-display font-bold text-gray-800 dark:text-gray-100">Potential Applications for Your {sector === 'church' ? 'Ministry' : 'Venue'}</h3>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                             {applications[sector].slice(0, 5).map((app, index) => (
                                <div key={index} className="p-4 bg-white dark:bg-gray-900/50 rounded-lg border dark:border-gray-700 flex items-center gap-3">
                                    <IconCheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                                    <p className="text-gray-700 dark:text-gray-300">{app}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-12 border-t dark:border-gray-700 pt-8 text-center">
                        {!skipAutoRedirect && countdown > 0 ? (
                            <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg animate-pulse-warm border border-blue-200 dark:border-blue-800">
                                <h3 className="text-xl font-display font-bold text-church-primary dark:text-blue-300">Next, Your Buyer's Guide</h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-300">
                                    To help you plan, we're taking you to our complete Buyer's Guide in <span className="font-bold text-lg mx-1">{countdown}</span> seconds...
                                </p>
                                <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <button onClick={() => setSkipAutoRedirect(true)} className="text-sm text-gray-500 hover:underline dark:text-gray-400">
                                        Stay on this page
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h3 className="text-2xl font-display font-bold dark:text-gray-100">Your Next Step</h3>
                                <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-xl mx-auto">Our comprehensive Buyer's Guide is the perfect resource to help you understand the technology and make an informed decision.</p>
                                <div className="mt-6 flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4">
                                    <button 
                                        onClick={onNavigateToGuide}
                                        className="inline-flex items-center justify-center px-8 py-3 font-bold text-white rounded-md bg-church-primary hover:opacity-90 transition-colors text-lg shadow-lg hover:shadow-xl"
                                    >
                                        <IconBookOpen className="w-6 h-6" />
                                        <span className="ml-2">📖 Explore Complete Buyer's Guide</span>
                                    </button>
                                    <button 
                                        onClick={handleBookMeeting}
                                        className="text-sm text-church-primary dark:text-church-accent font-semibold hover:underline"
                                    >
                                        Or, Schedule a Consultation Now
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-12 flex items-center justify-center gap-6">
                        <button onClick={() => setIsShareModalOpen(true)} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 font-semibold flex items-center mx-auto transition-colors text-sm">
                            <IconShare className="w-5 h-5" />
                            <span className="ml-2">Share Results</span>
                        </button>
                         <button onClick={onReset} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 font-semibold flex items-center mx-auto transition-colors text-sm">
                            <IconRefresh className="mr-2"/>
                            Start Over
                        </button>
                    </div>
                </div>
            </div>
            <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} result={result} />
        </>
    );
};

export default WarmLeadResult;