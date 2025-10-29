import React from 'react';
import { Result, Sector } from '../types';
import { HUBSPOT_CONFIG } from '../constants';
import * as HubSpot from '../services/hubspot';
import { IconCalendar, IconPhone, IconRefresh, IconCheckCircle, IconShare } from './common/Icon';
import ScoreGauge from './common/ScoreGauge';

interface ConfirmationProps {
    result: Result;
    onReset: () => void;
    sector: Sector;
}

const trackMetaEvent = (eventName: string, params: object = {}) => {
    console.log(`[Meta Pixel Event]: ${eventName}`, params);
};

const ConfettiPiece: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
    <div className="absolute w-2 h-4" style={style}></div>
);

const Confetti: React.FC = () => {
    const pieces = Array.from({ length: 50 }).map((_, i) => {
        const style: React.CSSProperties = {
            left: `${Math.random() * 100}%`,
            animation: `confetti-fall ${1 + Math.random()}s ease-out ${Math.random() * 2}s forwards`,
            backgroundColor: ['#2B4C7E', '#D4AF37', '#1B365D', '#FF6B35'][Math.floor(Math.random() * 4)],
        };
        return <ConfettiPiece key={i} style={style} />;
    });
    return <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">{pieces}</div>;
};

const Confirmation: React.FC<ConfirmationProps> = ({ result, onReset, sector }) => {
    const { userData, score, maxScore, geminiInsights, leadStatus } = result;

    const handleBookMeeting = () => {
        HubSpot.trackEvent('Calendar Booking Attempted', HubSpot.getSessionUserId(), { meeting_type: 'priority' });
        trackMetaEvent('Purchase', {
            content_type: 'consultation_booking',
            value: 500, // Average consultation conversion value
            currency: 'USD'
        });
        window.open(HUBSPOT_CONFIG.meetingLinks.priority, '_blank');
    };

    const handleShare = async () => {
        const shareData = {
            title: 'My TKCP LED Assessment Results',
            text: `I just took the TKCP LED Assessment and scored ${score}/${maxScore}! Check out this tool to see if an LED upgrade is right for you.`,
            url: window.location.origin,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
                console.log('Results shared successfully');
            } else {
                // Fallback for browsers that don't support Web Share API
                const subject = encodeURIComponent(shareData.title);
                const body = encodeURIComponent(`${shareData.text}\n\n${shareData.url}`);
                window.location.href = `mailto:?subject=${subject}&body=${body}`;
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    const leadStatusStyles: { [key: string]: string } = {
        hot: 'animate-pulse-hot rounded-full',
        warm: 'animate-pulse-warm rounded-full',
        cold: '',
    };


    return (
        <div className="max-w-3xl mx-auto text-center animate-fade-in relative">
            <Confetti />
            <div className="bg-white rounded-lg shadow-2xl p-8 md:p-12 relative z-10">
                <div className="text-5xl mb-4 animate-bounce-in">🎉</div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-800">You're All Set, {userData.firstName || 'Friend'}!</h2>
                <p className="mt-4 text-lg text-gray-600">
                    Your results are in. We're sending a copy to <strong>{userData.email || "your email"}</strong>, and a team member will call you within 24 business hours.
                </p>

                 <div className="flex justify-center my-8">
                    <div className={leadStatusStyles[leadStatus] || ''}>
                        <ScoreGauge score={score} maxScore={maxScore} sector={sector} />
                    </div>
                </div>

                {geminiInsights && (
                    <div className="mt-8 text-left bg-gray-50 p-6 rounded-lg border animate-fade-in-up">
                        <h3 className="text-xl font-display font-bold text-gray-800 text-center mb-4">Your Personalized Insights</h3>
                        <p className="text-gray-700 text-center">{geminiInsights.summary}</p>
                        <h4 className="font-bold text-gray-700 mt-6 mb-2 text-center">Your Actionable Next Steps:</h4>
                        <ul className="space-y-2 max-w-md mx-auto">
                            {geminiInsights.actionable_steps.map((step, i) => (
                                <li key={i} className="flex items-start">
                                    <IconCheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                                    <span>{step}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}


                <div className="mt-10 border-t pt-8">
                    <h3 className="text-2xl font-display font-bold">Can't Wait?</h3>
                    <p className="text-gray-600 mt-2">Feel free to reach out to us directly or share your results.</p>
                    <div className="mt-6 flex flex-col sm:flex-row flex-wrap justify-center gap-4">
                        <button onClick={handleBookMeeting} className="flex items-center justify-center w-full sm:w-auto px-8 py-3 font-bold text-white rounded-md bg-church-primary hover:opacity-90 transition-opacity">
                            <IconCalendar className="w-5 h-5" />
                            <span className="ml-2">Book a Time Now</span>
                        </button>
                        <a href="tel:+14698409808" className="flex items-center justify-center w-full sm:w-auto px-8 py-3 font-bold text-white rounded-md bg-church-accent hover:opacity-90 transition-opacity">
                            <IconPhone className="w-5 h-5" />
                            <span className="ml-2">Call Us Directly</span>
                        </a>
                        <button onClick={handleShare} className="flex items-center justify-center w-full sm:w-auto px-8 py-3 font-bold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors">
                            <IconShare className="w-5 h-5" />
                            <span className="ml-2">Share Your Results</span>
                        </button>
                    </div>
                </div>

                <div className="mt-12">
                     <button onClick={onReset} className="text-gray-500 hover:text-gray-800 font-semibold flex items-center mx-auto transition-colors">
                        <IconRefresh className="mr-2"/>
                        Start Over
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Confirmation;