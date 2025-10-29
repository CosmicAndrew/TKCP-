import React, { useState, useCallback, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sector, LeadStatus, UserData, Answer } from './types';
import { ASSESSMENT_QUESTIONS, calculateLeadTemperature } from './constants';
import Header from './components/Header';
import Quiz from './components/Quiz';
import Confirmation from './components/Confirmation';
import BuyersGuide from './components/BuyersGuide';
import Footer from './components/Footer';
import Spinner from './components/common/Spinner';

// Placeholder for Meta Pixel tracking
const trackEvent = (eventName: string, params: object = {}) => {
    console.log(`Meta Pixel Event: ${eventName}`, params);
    // In a real app, you would integrate the Meta Pixel SDK here.
    // window.fbq('track', eventName, params);
};


const App: React.FC = () => {
    const [step, setStep] = useState<'loading' | 'quiz' | 'confirmation' | 'buyersGuide'>('loading');
    const [sector, setSector] = useState<Sector | null>(null);
    const [quizResult, setQuizResult] = useState<{
        userData: Partial<UserData>;
        leadStatus: LeadStatus;
        score: number;
        answers: { [key: number]: Answer };
    } | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        trackEvent('PageView');
        
        // Auto-detect sector from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const sectorParam = (urlParams.get('sector') || urlParams.get('org') || '').toLowerCase();
        const utmCampaign = (urlParams.get('utm_campaign') || '').toLowerCase();

        let detectedSector: Sector = Sector.Church; // Default to church

        if (utmCampaign.includes('hospitality') || sectorParam === 'hospitality' || sectorParam === 'venue' || sectorParam === 'business') {
            detectedSector = Sector.Hospitality;
        } else if (utmCampaign.includes('church') || sectorParam === 'church' || sectorParam === 'worship' || sectorParam === 'ministry') {
            detectedSector = Sector.Church;
        }
        
        console.log(`Detected Sector: ${detectedSector}`);
        setSector(detectedSector);
        setStep('quiz');

    }, []);

    const generatePersonalizedInsights = useCallback(async (finalScore: number, finalAnswers: { [key: number]: Answer }, finalSector: Sector) => {
        setIsLoading(true);
        setError(null);
        try {
            if (!process.env.API_KEY) {
                throw new Error("API key is not configured.");
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            const formattedAnswers = ASSESSMENT_QUESTIONS.map((q, index) => {
                const answer = finalAnswers[index];
                if (!answer) return null;
                const option = q.options.find(o => o.value === answer.value);
                return {
                    question: q.text(finalSector),
                    answer: option ? option.text[finalSector] : 'Not answered',
                    points: answer.points
                };
            }).filter(Boolean);

            const prompt = `
            You are an expert BANT (Budget, Authority, Need, Timeline) sales consultant for TKCP.
            A potential client from the '${finalSector === 'church' ? 'House of Worship' : 'Venue/Business'}' sector has completed a qualification assessment.
            Their final score is ${finalScore} out of 16.
            Their answers: ${JSON.stringify(formattedAnswers, null, 2)}
            Based on this, generate a brief, encouraging summary and three actionable insights to be sent in a follow-up email.
            The tone should be consultative and justify the next steps.
            `;
            
            const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
            console.log("Generated Insights for Follow-up:", response.text);

        } catch (e) {
            console.error("Error generating insights:", e);
            setError("Failed to generate insights for follow-up.");
        } finally {
            setIsLoading(false);
        }
    }, []);


    const handleQuizComplete = (finalAnswers: { [key: number]: Answer }, finalUserData: Partial<UserData>) => {
        const totalScore = Object.values(finalAnswers).reduce((sum, answer) => sum + answer.points, 0);
        const leadStatus = calculateLeadTemperature(totalScore);

        if (totalScore >= 12) {
            trackEvent('HighValueLead', { score: totalScore, status: leadStatus });
        }
        trackEvent('LeadSubmitted', { score: totalScore, status: leadStatus, commitment: finalAnswers[4]?.value });

        setQuizResult({ userData: finalUserData, leadStatus, score: totalScore, answers: finalAnswers });
        
        if (sector) {
            generatePersonalizedInsights(totalScore, finalAnswers, sector);
        }
        
        const commitment = finalAnswers[ASSESSMENT_QUESTIONS.length - 1]?.value;
        if (commitment === 'exploring') {
            trackEvent('BuyersGuideViewed', { score: totalScore });
            setStep('buyersGuide');
        } else {
            setStep('confirmation');
        }
    };

    const handleReset = () => {
        window.location.search = ''; // Clears params and re-triggers detection
    };

    const renderContent = () => {
        switch(step) {
            case 'loading':
                return <div className="flex justify-center items-center h-64"><Spinner /></div>;
            case 'quiz':
                 if (sector) {
                    return <Quiz sector={sector} onComplete={handleQuizComplete} />;
                 }
                 // This case should ideally not be reached due to the initial detection
                 return <div className="text-center">Loading assessment...</div>;
            case 'confirmation':
                if (quizResult) {
                     return <Confirmation result={quizResult} onReset={handleReset} />;
                }
                 setStep('loading'); // Go back to loading to re-detect
                 return null;
            case 'buyersGuide':
                if (quizResult && sector) {
                    return <BuyersGuide result={quizResult} sector={sector} onReset={handleReset} />;
                }
                setStep('loading'); // Go back to loading to re-detect
                return null;
            default:
                setStep('loading');
                return null;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-neutral-light">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
                {renderContent()}
            </main>
            <Footer />
        </div>
    );
};

export default App;