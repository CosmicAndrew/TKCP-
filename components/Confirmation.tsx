import React, { useState } from 'react';
import { ResultPageProps } from '../types';
import { HUBSPOT_CONFIG, TKCP_CONFIG } from '../constants';
import * as HubSpot from '../services/hubspot';
import { trackMetaEvent } from '../services/tracking';
import { IconCalendar, IconPhone, IconRefresh, IconShare, IconCheckCircle, IconBookOpen } from './common/Icon';
import Confetti from './common/Confetti';
import ShareModal from './common/ShareModal';
import CategoryScoreBreakdown from './common/CategoryScoreBreakdown';

const applications = {
    church: [
        "Worship services - Song lyrics, sermon notes, scripture",
        "Announcements - Service times, events, giving campaigns",
        "Live-streaming - Broadcast-quality online services",
        "Youth ministry - Gaming, movies, interactive content",
        "Special services - Christmas, Easter, baptisms, weddings",
        "Multi-site - Synchronized content across campuses",
        "Fellowship - Photo slideshows, community updates",
    ],
    hospitality: [
        "Corporate events - Presentations, keynotes, branding",
        "Concerts - Stage backdrops, artist visuals, lighting",
        "Wayfinding - Digital signage, conference schedules",
        "Weddings - Custom monograms, photo slideshows",
        "Trade shows - Booth displays, product demos",
        "Hotel lobbies - Brand messaging, local attractions",
        "Conference centers - Multi-room event displays",
    ]
};

const HotLeadResult: React.FC<ResultPageProps> = ({ result, onReset, sector, onNavigateToGuide }) => {
    const { userData, score, maxScore, geminiInsights } = result;
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const linkClass = "text-church-primary dark:text-church-accent underline hover:text-opacity-80 transition-colors duration-300";

    const handleBookMeeting = () => {
        HubSpot.trackEvent('Calendar Booking Attempted', HubSpot.getSessionUserId(), { meeting_type: 'priority' });
        trackMetaEvent('Purchase', {
            content_type: 'consultation_booking',
            value: 500, // Average consultation conversion value
            currency: 'USD'
        });
        
        const url = new URL(HUBSPOT_CONFIG.meetingLinks.priority);
        if (userData.firstName) url.searchParams.append('firstname', userData.firstName);
        if (userData.lastName) url.searchParams.append('lastname', userData.lastName);
        if (userData.email) url.searchParams.append('email', userData.email);
        
        url.searchParams.append('utm_source', 'assessment');
        url.searchParams.append('utm_medium', 'results_hot');
        url.searchParams.append('utm_campaign', 'q4_led_screens');

        window.open(url.toString(), '_blank');
    };

    return (
        <>
            <div className="max-w-4xl mx-auto animate-fade-in relative rounded-lg">
                <Confetti intensity="heavy" />

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 md:p-10 relative z-10">
                    <div className="text-5xl mb-4 animate-bounce-in">🎉</div>
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-800 dark:text-gray-100">
                        You're Ready for Professional <a href="https://thykingdomcomeproductions.com" target="_blank" rel="noopener noreferrer" className={linkClass}>LED Video Walls</a>
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                        Congratulations, {userData.firstName || 'Friend'}! Your assessment score of <strong>{score}/{maxScore}</strong> indicates you're a prime candidate for a transformative visual upgrade.
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
                             {applications[sector].slice(0, 7).map((app, index) => (
                                <div key={index} className="p-4 bg-white dark:bg-gray-900/50 rounded-lg border dark:border-gray-700 flex items-center gap-3">
                                    <IconCheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                                    <p className="text-gray-700 dark:text-gray-300">{app}</p>
                                </div>
                            ))}
                        </div>
                    </div>


                    <div className="mt-12 border-t dark:border-gray-700 pt-8 text-center">
                        <h3 className="text-2xl font-display font-bold dark:text-gray-100">Your Priority Next Step</h3>
                        <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-xl mx-auto">Your results indicate a strong, immediate need. Let's not wait. Book a priority consultation to get a detailed quote and a live demo.</p>
                        <div className="mt-6 flex flex-col sm:flex-row flex-wrap justify-center gap-4">
                            <button 
                                onClick={handleBookMeeting} 
                                className="flex items-center justify-center w-full sm:w-auto px-8 py-4 font-bold text-white rounded-md bg-church-primary hover:opacity-90 transition-all text-lg animate-pulse-glow-primary shadow-lg hover:shadow-xl"
                            >
                                <IconCalendar className="w-6 h-6" />
                                <span className="ml-2">Schedule Priority Consultation</span>
                            </button>
                            <a href={TKCP_CONFIG.phoneLink} className="flex items-center justify-center w-full sm:w-auto px-6 py-3 font-bold text-gray-900 rounded-md bg-church-accent hover:bg-yellow-400 transition-colors text-base shadow-md hover:shadow-lg">
                                <IconPhone className="w-5 h-5" />
                                <span className="ml-2">Or Call Us: {TKCP_CONFIG.phone}</span>
                            </a>
                        </div>
                        <div className="mt-6 flex justify-center items-center gap-x-6 text-sm font-semibold text-gray-600 dark:text-gray-400">
                           <span>✓ 3-Day Installation</span>
                           <span>✓ 100,000+ Hour Lifespan</span>
                           <span>✓ 200+ Churches Served</span>
                        </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <blockquote className="text-center bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-l-4 border-church-accent">
                            <p className="text-gray-700 dark:text-gray-300 italic">"Installed 3 LED video walls in our 3,500-seat sanctuary. Experience was fantastic—we recommend them to anyone."</p>
                            <cite className="block text-right mt-2 not-italic font-semibold text-gray-600 dark:text-gray-400">— Brenden Burge, Church Client | <a href="https://thykingdomcomeproductions.com/testimonials" target="_blank" rel="noopener noreferrer" className={linkClass}>Read More</a></cite>
                        </blockquote>
                    </div>

                    <div className="mt-12 flex items-center justify-center gap-6">
                         <button onClick={onNavigateToGuide} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 font-semibold flex items-center mx-auto transition-colors text-sm">
                            <IconBookOpen className="mr-2"/>
                            Explore Buyer's Guide
                        </button>
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

export default HotLeadResult;