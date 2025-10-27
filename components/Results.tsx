import React from 'react';
import { Sector, LeadStatus, UserData } from '../types';
import Spinner from './common/Spinner';
import ScoreGauge from './common/ScoreGauge';
import { IconCheckCircle, IconMail, IconPhone, IconCalendar, IconDownload, IconVideo, IconBookOpen, IconRefresh } from './common/Icon';

interface ResultsProps {
    sector: Sector;
    score: number;
    leadStatus: LeadStatus;
    insights: string[];
    isLoading: boolean;
    error: string | null;
    onReset: () => void;
    completionTime: number;
    userData: UserData;
}

interface CTA {
  text: string;
  subtext?: string;
  icon: React.ReactNode;
  href: string;
}

const getStatusDetails = (status: LeadStatus, sector: Sector): { headline: string; color: string; textColor: string; borderColor: string; bgColor: string; primaryCTA: CTA; secondaryCTA: CTA; } => {
    switch (status) {
        case 'hot':
            return {
                headline: "You’re an ideal fit for a premium LED solution!",
                color: 'green',
                textColor: `text-green-600`,
                borderColor: `border-green-500`,
                bgColor: `bg-green-50`,
                primaryCTA: { text: "Schedule Priority Budget Discussion", subtext: "Next 48 Hours Only", icon: <IconCalendar />, href: "#" },
                secondaryCTA: { text: "Call Us Now", icon: <IconPhone />, href: "tel:+14698409808" }
            };
        case 'warm':
            return {
                headline: "Great potential for an LED transformation.",
                color: 'yellow',
                textColor: `text-yellow-600`,
                borderColor: `border-yellow-500`,
                bgColor: `bg-yellow-50`,
                primaryCTA: { text: "Download ROI Calculator", icon: <IconDownload />, href: "#" },
                secondaryCTA: { text: "Reserve Discovery Call", icon: <IconVideo />, href: "#" }
            };
        case 'cold':
        default:
            return {
                headline: "Start your LED journey with expert guidance.",
                color: 'blue',
                textColor: `text-blue-600`,
                borderColor: `border-blue-500`,
                bgColor: `bg-blue-50`,
                primaryCTA: { text: "Get the LED Buyer's Guide", icon: <IconBookOpen />, href: "#" },
                secondaryCTA: { text: "Subscribe to LED Insights", icon: <IconMail />, href: "#" }
            };
    }
};

const Results: React.FC<ResultsProps> = ({ sector, score, leadStatus, insights, isLoading, error, onReset, completionTime, userData }) => {
    const details = getStatusDetails(leadStatus, sector);
    const accentBg = sector === Sector.Church ? 'bg-church-accent' : 'bg-hospitality-accent';
    const primaryBg = sector === Sector.Church ? 'bg-church-primary' : 'bg-hospitality-primary';
    
    return (
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="bg-white rounded-lg shadow-2xl p-8 md:p-12">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-800">{details.headline}</h2>
                <p className="mt-2 text-lg text-gray-600">
                    Thank you, {userData.firstName}. Here's your personalized assessment summary.
                </p>

                <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="flex flex-col items-center">
                        <ScoreGauge score={score} maxScore={10} sector={sector} />
                        <p className="mt-2 text-gray-500 text-sm">Completed in {completionTime} seconds</p>
                    </div>
                    
                    <div className={`p-6 rounded-lg text-left ${details.bgColor} ${details.borderColor} border`}>
                        <h3 className={`text-xl font-bold ${details.textColor}`}>Your Personalized Insights</h3>
                        {isLoading ? (
                            <div className="flex items-center justify-center h-32">
                                <Spinner />
                            </div>
                        ) : error ? (
                            <div className="mt-4 text-red-600">{error}</div>
                        ) : (
                            <ul className="mt-4 space-y-3">
                                {insights.map((insight, index) => (
                                    <li key={index} className="flex items-start">
                                        <IconCheckCircle className={`flex-shrink-0 w-6 h-6 mr-3 ${details.textColor}`} />
                                        <span>{insight}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="mt-10 border-t pt-8">
                    <h3 className="text-2xl font-display font-bold">Your Next Steps</h3>
                    <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                        <a href={details.primaryCTA.href} className={`flex items-center justify-center w-full sm:w-auto px-8 py-3 font-bold text-white rounded-md ${primaryBg} hover:opacity-90 transition-opacity`}>
                            {details.primaryCTA.icon}
                            <div className="ml-2 text-left">
                                <span>{details.primaryCTA.text}</span>
                                {details.primaryCTA.subtext && (
                                    <span className="block text-xs opacity-80 font-normal">{details.primaryCTA.subtext}</span>
                                )}
                            </div>
                        </a>
                        <a href={details.secondaryCTA.href} className={`flex items-center justify-center w-full sm:w-auto px-8 py-3 font-bold text-white rounded-md ${accentBg} hover:opacity-90 transition-opacity`}>
                            {details.secondaryCTA.icon}
                            <span className="ml-2">{details.secondaryCTA.text}</span>
                        </a>
                    </div>
                </div>

                <div className="mt-12">
                     <button onClick={onReset} className="text-gray-500 hover:text-gray-800 font-semibold flex items-center mx-auto transition-colors">
                        <IconRefresh className="mr-2"/>
                        Take the Assessment Again
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Results;
