import React, { useState } from 'react';
import { Result, Sector } from '../types';
import { HUBSPOT_CONFIG, TKCP_CONFIG } from '../constants';
import * as HubSpot from '../services/hubspot';
import { IconCalendar, IconPhone, IconRefresh, IconShare, IconLightbulb, IconTarget, IconTrendingUp } from './common/Icon';
import ScoreGauge from './common/ScoreGauge';
import CategoryScoreBreakdown from './common/CategoryScoreBreakdown';
import Feedback from './common/Feedback';
import Confetti from './common/Confetti';
import ShareModal from './common/ShareModal';

interface ConfirmationProps {
    result: Result;
    onReset: () => void;
    sector: Sector;
}

const trackMetaEvent = (eventName: string, params: object = {}) => {
    console.log(`[Meta Pixel Event]: ${eventName}`, params);
};

const InsightIcon = ({ index, sector }: { index: number, sector: Sector }) => {
    const icons = [<IconLightbulb />, <IconTarget />, <IconTrendingUp />];
    const colors = sector === Sector.Church 
        ? 'text-church-primary dark:text-blue-300'
        : 'text-hospitality-primary dark:text-orange-300';
    return <div className={`w-10 h-10 flex items-center justify-center rounded-lg bg-white/50 dark:bg-gray-900/30 ${colors}`}>{icons[index % icons.length]}</div>
};

const Confirmation: React.FC<ConfirmationProps> = ({ result, onReset, sector }) => {
    const { userData, score, maxScore, geminiInsights, leadStatus } = result;
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

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
        url.searchParams.append('utm_medium', 'results');
        url.searchParams.append('utm_campaign', 'q4_led_screens');

        window.open(url.toString(), '_blank');
    };

    const leadStatusStyles: { [key: string]: string } = {
        hot: 'animate-pulse-hot rounded-full',
        warm: 'animate-pulse-warm rounded-full',
        cold: '',
    };
    
    const shimmerColors = sector === Sector.Church 
      ? 'from-church-primary/30 via-church-accent/30 to-church-primary/30'
      : 'from-hospitality-primary/30 via-hospitality-accent/30 to-hospitality-primary/30'


    return (
        <>
            <div className="max-w-4xl mx-auto text-center animate-fade-in relative overflow-hidden rounded-lg">
                <Confetti intensity="medium" />
                {/* Background Shimmer Effect */}
                <div className={`absolute inset-0 z-0 bg-gradient-to-r ${shimmerColors} bg-[size:200%_200%] animate-shimmer-bg opacity-20 dark:opacity-30`} />

                <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-2xl p-8 md:p-12 relative z-10">
                    <div className="text-5xl mb-4 animate-bounce-in">🎉</div>
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-800 dark:text-gray-100">You're All Set, {userData.firstName || 'Friend'}!</h2>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                        Your results are in. We're sending a copy to <strong>{userData.email || "your email"}</strong>.
                    </p>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-8 my-8">
                        <div className={`mx-auto md:mx-0 ${leadStatusStyles[leadStatus] || ''}`}>
                            <ScoreGauge score={score} maxScore={maxScore} sector={sector} />
                        </div>
                        <div className="w-full md:max-w-sm">
                            <CategoryScoreBreakdown result={result} />
                        </div>
                    </div>

                    {geminiInsights && (
                        <div className="mt-8 text-left">
                            <h3 className="text-xl font-display font-bold text-gray-800 dark:text-gray-100 text-center mb-4">
                                ✨ AI-Powered Insights
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 text-center mb-6 max-w-2xl mx-auto">{geminiInsights.summary}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {geminiInsights.actionable_steps.map((stepText, i) => (
                                    <div
                                        key={i}
                                        className="p-5 rounded-xl bg-white/50 dark:bg-gray-900/30 border dark:border-gray-700 shadow-md transform transition-all hover:-translate-y-1 animate-fade-in-up"
                                        style={{ animationDelay: `${200 + i * 200}ms` }}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 text-church-primary font-bold text-lg bg-gray-200 dark:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center">
                                                {i + 1}
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex items-center gap-3">
                                                    <InsightIcon index={i} sector={sector} />
                                                    <p className="font-semibold text-lg text-gray-600 dark:text-gray-300">{stepText}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}


                    <div className="mt-12 border-t dark:border-gray-700 pt-8">
                        <h3 className="text-2xl font-display font-bold dark:text-gray-100">Ready to Take the Next Step?</h3>
                        <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-xl mx-auto">Book your free, no-obligation consultation to get a detailed quote and see a live demo.</p>
                        <div className="mt-6 flex flex-col sm:flex-row flex-wrap justify-center gap-4">
                            <button 
                                onClick={handleBookMeeting} 
                                className="flex items-center justify-center w-full sm:w-auto px-8 py-4 font-bold text-white rounded-md bg-church-primary hover:opacity-90 transition-all text-lg animate-pulse-glow-primary shadow-lg hover:shadow-xl"
                            >
                                <IconCalendar className="w-6 h-6" />
                                <span className="ml-2">Schedule Your Free Consultation</span>
                            </button>
                            <a href={TKCP_CONFIG.phoneLink} className="flex items-center justify-center w-full sm:w-auto px-6 py-3 font-bold text-gray-900 rounded-md bg-church-accent hover:bg-yellow-400 transition-colors text-base shadow-md hover:shadow-lg">
                                <IconPhone className="w-5 h-5" />
                                <span className="ml-2">Or Call Us Directly</span>
                            </a>
                        </div>
                    </div>

                    <div className="mt-12 max-w-lg mx-auto">
                        <Feedback />
                    </div>


                    <div className="mt-12 flex items-center justify-center gap-6">
                        <button onClick={onReset} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 font-semibold flex items-center mx-auto transition-colors text-sm">
                            <IconRefresh className="mr-2"/>
                            Start Over
                        </button>
                        <button onClick={() => setIsShareModalOpen(true)} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 font-semibold flex items-center mx-auto transition-colors text-sm">
                            <IconShare className="w-5 h-5" />
                            <span className="ml-2">Share Results</span>
                        </button>
                    </div>
                </div>
            </div>
            <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} result={result} />
        </>
    );
};

export default Confirmation;