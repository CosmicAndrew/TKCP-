import React, { useState, useCallback, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sector, LeadStatus, UserData, Answer } from './types';
import { ASSESSMENT_QUESTIONS, calculateLeadTemperature } from './constants';
import Header from './components/Header';
import Landing from './components/Landing';
import Quiz from './components/Quiz';
import Confirmation from './components/Confirmation';
import BuyersGuide from './components/BuyersGuide';
import Footer from './components/Footer';

// Placeholder for Meta Pixel tracking
const trackEvent = (eventName: string, params: object = {}) => {
    console.log(`Meta Pixel Event: ${eventName}`, params);
    // In a real app, you would integrate the Meta Pixel SDK here.
    // window.fbq('track', eventName, params);
};


const App: React.FC = () => {
    const [step, setStep] = useState<'landing' | 'quiz' | 'confirmation' | 'buyersGuide'>('landing');
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
    }, []);

    const handleStart = (selectedSector: Sector) => {
        trackEvent('SectorSelected', { sector: selectedSector });
        setSector(selectedSector);
        setStep('quiz');
    };

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
                    question: q.text,
                    answer: option ? option.text[finalSector] : 'Not answered',
                    points: answer.points
                };
            }).filter(Boolean);

            const prompt = `
            You are an expert BANT (Budget, Authority, Need, Timeline) sales consultant for TKCP.
            A potential client from the '${finalSector === 'church' ? 'House of Worship' : 'Venue/Business'}' sector has completed a qualification assessment.
            Their final score is ${finalScore} out of 20.
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
        setStep('landing');
        setSector(null);
        setQuizResult(null);
        setIsLoading(false);
        setError(null);
    };

    const renderContent = () => {
        switch(step) {
            case 'landing':
                return <Landing onStart={handleStart} />;
            case 'quiz':
                 if (sector) {
                    return <Quiz sector={sector} onComplete={handleQuizComplete} />;
                 }
                 setStep('landing');
                 return <Landing onStart={handleStart} />;
            case 'confirmation':
                if (quizResult) {
                     return <Confirmation result={quizResult} onReset={handleReset} />;
                }
                 setStep('landing');
                 return <Landing onStart={handleStart} />;
            case 'buyersGuide':
                if (quizResult && sector) {
                    return <BuyersGuide result={quizResult} sector={sector} onReset={handleReset} />;
                }
                setStep('landing');
                return <Landing onStart={handleStart} />;
            default:
                return <Landing onStart={handleStart} />;
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