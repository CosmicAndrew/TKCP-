import React, { useState } from 'react';
import { Result, Sector } from '../types';
import { HUBSPOT_CONFIG, TKCP_CONFIG } from '../constants';
import * as HubSpot from '../services/hubspot';
import { IconCalendar, IconPhone, IconRefresh, IconShare, IconLightbulb, IconTarget, IconTrendingUp, IconBookOpen, IconCheckCircle } from './common/Icon';
import ScoreGauge from './common/ScoreGauge';
import CategoryScoreBreakdown from './common/CategoryScoreBreakdown';
import Feedback from './common/Feedback';
import Confetti from './common/Confetti';
import ShareModal from './common/ShareModal';

interface ResultsProps {
    result: Result;
    onReset: () => void;
    sector: Sector;
}

const trackMetaEvent = (eventName: string, params: object = {}) => {
    console.log(`[Meta Pixel Event]: ${eventName}`, params);
};

const handleBookMeeting = (meetingType: 'priority' | 'discovery', userData: any) => {
    HubSpot.trackEvent('Calendar Booking Attempted', HubSpot.getSessionUserId(), { meeting_type: meetingType });
    trackMetaEvent('Purchase', {
        content_type: 'consultation_booking', value: 500, currency: 'USD'
    });
    
    const url = new URL(HUBSPOT_CONFIG.meetingLinks[meetingType]);
    if (userData.firstName) url.searchParams.append('firstname', userData.firstName);
    if (userData.lastName) url.searchParams.append('lastname', userData.lastName);
    if (userData.email) url.searchParams.append('email', userData.email);
    
    url.searchParams.append('utm_source', 'assessment_results');
    url.searchParams.append('utm_campaign', `q4_led_screens_${meetingType}`);

    window.open(url.toString(), '_blank');
};

const ApplicationList: React.FC<{ sector: Sector, level: 'hot' | 'warm' | 'cold' }> = ({ sector, level }) => {
    const applications = {
        church: [
            { text: "Worship lyrics & sermon notes", link: "https://thykingdomcomeproductions.com/church-led-walls/" },
            { text: "Announcements & giving campaigns", link: null },
            { text: "Live-streaming with HD LED displays", link: "https://thykingdomcomeproductions.com/indoor-led-video-wall-packages/" },
            { text: "Youth ministry & special services", link: null },
            { text: "Christmas/Easter services", link: "https://thykingdomcomeproductions.com/church-led-walls/" },
            { text: "Multi-site campus integration", link: null }
        ],
        hospitality: [
            { text: "Corporate events & presentations", link: "https://thykingdomcomeproductions.com/led-display-rentals/" },
            { text: "Concerts & live entertainment", link: "https://thykingdomcomeproductions.com/led-display-rentals/" },
            { text: "Wayfinding & digital signage", link: "https://thykingdomcomeproductions.com/digital-signage/" },
            { text: "Weddings & special events", link: null },
            { text: "Trade shows & conferences", link: null },
            { text: "Hotel branding & lobbies", link: "https://thykingdomcomeproductions.com/indoor-led-video-wall-packages/" }
        ]
    };
    
    const count = level === 'hot' ? 7 : level === 'warm' ? 4 : 2;
    const appList = applications[sector].slice(0, count);

    return (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-left mt-4">
            {appList.map((app, i) => (
                <li key={i} className="flex items-start">
                    <IconCheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    {app.link ? (
                        <a href={app.link} target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-gray-300 hover:underline">{app.text}</a>
                    ) : (
                        <span className="text-gray-700 dark:text-gray-300">{app.text}</span>
                    )}
                </li>
            ))}
        </ul>
    );
};


const Results: React.FC<ResultsProps> = ({ result, onReset, sector }) => {
    const { userData, score, maxScore, geminiInsights, leadStatus } = result;
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const leadStatusStyles: { [key: string]: string } = {
        hot: 'animate-pulse-hot rounded-full',
        warm: 'animate-pulse-warm rounded-full',
        cold: '',
    };
    
    const shimmerColors = sector === Sector.Church 
      ? 'from-church-primary/30 via-church-accent/30 to-church-primary/30'
      : 'from-hospitality-primary/30 via-hospitality-accent/30 to-hospitality-primary/30'

    const renderHotLeadContent = () => (
        <>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-800 dark:text-gray-100">Your Priority Assessment: An <a href="https://thykingdomcomeproductions.com/church-led-walls/" className="underline">LED Wall</a> Is a Strong Fit for Your Goals</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Based on your answers, upgrading your <a href="https://thykingdomcomeproductions.com/" className="underline">LED video walls</a> is a high-impact decision for your organization.</p>
            <div className="mt-6">
                <h3 className="text-xl font-bold font-display">Common Applications for Your Sector:</h3>
                <ApplicationList sector={sector} level="hot" />
            </div>
             <div className="mt-8 border-t dark:border-gray-700 pt-8">
                <h3 className="text-2xl font-display font-bold dark:text-gray-100">Ready to Take the Next Step?</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-xl mx-auto">Book your free, no-obligation consultation to get a detailed quote and see a live demo.</p>
                <div className="mt-6 flex flex-col sm:flex-row flex-wrap justify-center gap-4">
                    <button 
                        onClick={() => handleBookMeeting('priority', userData)} 
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
                 <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">3-day installation | 100,000+ hour lifespan | <a href="https://thykingdomcomeproductions.com/testimonials/" className="underline">200+ churches served</a></p>
            </div>
        </>
    );

     const renderWarmLeadContent = () => (
        <>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-800 dark:text-gray-100">Great Potential: Explore the Benefits of Your New <a href="https://thykingdomcomeproductions.com/led-display-solutions/" className="underline">LED Display</a></h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Your organization is in a great position to benefit from an LED upgrade. Here's how it can help:</p>
            <div className="mt-6">
                <ApplicationList sector={sector} level="warm" />
            </div>
            <div className="mt-8 border-t dark:border-gray-700 pt-8">
                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
                     <button 
                        onClick={() => handleBookMeeting('discovery', userData)} 
                        className="flex items-center justify-center w-full sm:w-auto px-8 py-4 font-bold text-white rounded-md bg-church-primary hover:opacity-90 transition-all text-lg shadow-lg"
                    >
                        <IconCalendar className="w-6 h-6" />
                        <span className="ml-2">Schedule a Discovery Call</span>
                    </button>
                    <a href="https://thykingdomcomeproductions.com/led-display-solutions/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full sm:w-auto px-6 py-3 font-bold text-gray-900 rounded-md bg-church-accent hover:bg-yellow-400 transition-colors text-base shadow-md">
                        <IconBookOpen className="w-5 h-5" />
                        <span className="ml-2">Explore LED Solutions</span>
                    </a>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Check out our <a href="https://thykingdomcomeproductions.com/testimonials/" className="underline">client success stories</a>.</p>
            </div>
        </>
    );

    const renderColdLeadContent = () => (
        <>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-800 dark:text-gray-100">Planning for the Future: Learn More About <a href="https://thykingdomcomeproductions.com/church-led-walls/" className="underline">LED Walls</a></h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">You're in the early stages of exploring. Here are some key benefits to consider for your long-term planning:</p>
            <div className="mt-6">
                <ApplicationList sector={sector} level="cold" />
            </div>
            <div className="mt-8 border-t dark:border-gray-700 pt-8">
                <a href="https://thykingdomcomeproductions.com/led-display-solutions/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full sm:max-w-xs mx-auto px-6 py-3 font-bold text-white rounded-md bg-church-primary hover:opacity-90 transition-colors text-base shadow-md">
                    <IconBookOpen className="w-5 h-5" />
                    <span className="ml-2">Learn More About LED Displays</span>
                </a>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Read about our <a href="https://thykingdomcomeproductions.com/digital-signage/" className="underline">digital signage options</a>.</p>
            </div>
        </>
    );

    const renderContentByLeadStatus = () => {
        switch (leadStatus) {
            case 'hot': return renderHotLeadContent();
            case 'warm': return renderWarmLeadContent();
            case 'cold': return renderColdLeadContent();
            default: return null;
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto text-center animate-fade-in relative overflow-hidden rounded-lg">
                {leadStatus === 'hot' && <Confetti intensity="medium" />}
                <div className={`absolute inset-0 z-0 bg-gradient-to-r ${shimmerColors} bg-[size:200%_200%] animate-shimmer-bg opacity-20 dark:opacity-30`} />

                <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-2xl p-8 md:p-12 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-8 mb-8">
                        <div className={`mx-auto md:mx-0 ${leadStatusStyles[leadStatus] || ''}`}>
                            <ScoreGauge score={score} maxScore={maxScore} sector={sector} />
                        </div>
                        <div className="w-full md:max-w-sm">
                            <CategoryScoreBreakdown result={result} />
                        </div>
                    </div>
                    
                    {geminiInsights && (
                        <div className="mt-8 text-left mb-8">
                            <h3 className="text-xl font-display font-bold text-gray-800 dark:text-gray-100 text-center mb-4">✨ AI-Powered Insights for {userData.firstName || 'You'}</h3>
                            <p className="text-gray-700 dark:text-gray-300 text-center mb-6 max-w-2xl mx-auto">{geminiInsights.summary}</p>
                        </div>
                    )}

                    {renderContentByLeadStatus()}

                    <div className="mt-12 max-w-lg mx-auto">
                        <Feedback />
                    </div>

                    <div className="mt-12 flex items-center justify-center gap-6">
                        <button onClick={onReset} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 font-semibold flex items-center mx-auto transition-colors text-sm">
                            <IconRefresh className="mr-2"/> Start Over
                        </button>
                        <button onClick={() => setIsShareModalOpen(true)} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 font-semibold flex items-center mx-auto transition-colors text-sm">
                            <IconShare className="w-5 h-5" /> <span className="ml-2">Share Results</span>
                        </button>
                    </div>
                </div>
            </div>
            <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} result={result} />
        </>
    );
};

export default Results;
