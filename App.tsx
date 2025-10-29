import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Sector, LeadStatus, UserData, Answer, Result, GeminiInsights } from './types';
import { ASSESSMENT_QUESTIONS, calculateLeadTemperature } from './constants';
import * as HubSpot from './services/hubspot';
import Header from './components/Header';
import Landing from './components/Landing';
import Quiz from './components/Quiz';
import Confirmation from './components/Confirmation';
import BuyersGuide from './components/BuyersGuide';
import Footer from './components/Footer';
import Spinner from './components/common/Spinner';

// --- Conversion Tracking Functions ---

// Placeholder for Meta Pixel tracking
const trackMetaEvent = (eventName: string, params: object = {}) => {
    console.log(`[Meta Pixel Event]: ${eventName}`, params);
    // In a real app, you would integrate the Meta Pixel SDK here.
    // window.fbq('track', eventName, params);
};

// Placeholder for Google Analytics 4 tracking
const trackGA4Event = (eventName: string, params: object = {}) => {
    console.log(`[Google Analytics 4 Event]: ${eventName}`, params);
     // In a real app, you would integrate GA4 here.
    // window.gtag('event', eventName, params);
}


const App: React.FC = () => {
    const [step, setStep] = useState<'loading' | 'landing' | 'quiz' | 'confirmation' | 'buyersGuide'>('loading');
    const [sector, setSector] = useState<Sector | null>(null);
    const [quizResult, setQuizResult] = useState<Result | null>(null);
    const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const sessionUserId = useRef<string>(HubSpot.getSessionUserId());


    useEffect(() => {
        trackMetaEvent('PageView');
        
        // Auto-detect sector from URL parameters to allow direct links to quiz
        const urlParams = new URLSearchParams(window.location.search);
        const sectorParam = (urlParams.get('sector') || urlParams.get('org') || '').toLowerCase();
        const utmCampaign = (urlParams.get('utm_campaign') || '').toLowerCase();

        let detectedSector: Sector | null = null;

        if (utmCampaign.includes('hospitality') || sectorParam === 'hospitality' || sectorParam === 'venue' || sectorParam === 'business') {
            detectedSector = Sector.Hospitality;
        } else if (utmCampaign.includes('church') || sectorParam === 'church' || sectorParam === 'worship' || sectorParam === 'ministry') {
            detectedSector = Sector.Church;
        }
        
        if (detectedSector) {
            console.log(`Detected Sector from URL: ${detectedSector}`);
            localStorage.setItem('tkcp_sector', detectedSector); // Persist for HubSpot service
            setSector(detectedSector);
            setStep('quiz');
        } else {
            setStep('landing');
        }

    }, []);

    const generatePersonalizedInsights = useCallback(async (finalScore: number, finalAnswers: { [key: number]: Answer }, finalSector: Sector): Promise<GeminiInsights | null> => {
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
            You are an expert BANT (Budget, Authority, Need, Timeline) sales consultant for TKCP, a company selling high-end LED screens.
            A potential client from the '${finalSector === 'church' ? 'House of Worship' : 'Venue/Business'}' sector has completed a qualification assessment.
            Their final score is ${finalScore} out of 20.
            Their answers: ${JSON.stringify(formattedAnswers, null, 2)}
            
            Based on this, generate a response in JSON format. The JSON object must have two keys:
            1. "summary": A brief (2-3 sentences), encouraging summary for the user's results page. Frame their situation positively.
            2. "actionable_steps": An array of exactly 3 short, actionable, and encouraging next steps for the user.
            
            The tone must be consultative, positive, and justify taking the next step. Do not use markdown.
            `;
            
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            summary: { type: Type.STRING, description: "A brief, encouraging summary for the user." },
                            actionable_steps: {
                                type: Type.ARRAY,
                                description: "An array of 3 actionable next steps.",
                                items: { type: Type.STRING }
                            }
                        },
                        required: ["summary", "actionable_steps"]
                    }
                }
            });
            
            const insights = JSON.parse(response.text);
            console.log("Generated Insights for Summary:", insights);
            
            HubSpot.upsertContact({
                session_user_id: sessionUserId.current,
                gemini_followup_insights: JSON.stringify(insights, null, 2),
            });

            return insights;

        } catch (e) {
            console.error("Error generating insights:", e);
            setError("Failed to generate personalized insights.");
            return null;
        }
    }, []);
    
    const handleSectorSelect = (selectedSector: Sector) => {
        trackMetaEvent('Lead', { sector: selectedSector });
        HubSpot.trackEvent('Selected Sector', sessionUserId.current, { sector: selectedSector });
        console.log(`Selected Sector: ${selectedSector}`);
        localStorage.setItem('tkcp_sector', selectedSector); // Persist for HubSpot service
        setSector(selectedSector);
        setStep('quiz');
    };


    const handleQuizComplete = async (finalAnswers: { [key: number]: Answer }, finalUserData: Partial<UserData>) => {
        setSubmissionStatus('Analyzing your results...');
        await new Promise(res => setTimeout(res, 1000));
        
        const totalScore = Object.values(finalAnswers).reduce((sum, answer) => sum + answer.points, 0);
        const leadStatus = calculateLeadTemperature(totalScore);
        const maxScore = 20;

        let insights: GeminiInsights | null = null;
        if (sector) {
            setSubmissionStatus('Consulting our AI expert...');
            insights = await generatePersonalizedInsights(totalScore, finalAnswers, sector);
        }
        
        setSubmissionStatus('Tailoring your recommendations...');
        await new Promise(res => setTimeout(res, 1000));

        const result: Result = { 
            userData: finalUserData, 
            leadStatus, 
            score: totalScore, 
            answers: finalAnswers,
            maxScore,
            geminiInsights: insights ?? undefined
        };

        const commitment = finalAnswers[ASSESSMENT_QUESTIONS.length - 1]?.value;

        // --- Conversion Tracking ---
        trackMetaEvent('InitiateCheckout', {
            content_type: 'assessment',
            content_ids: ['tkcp_led_assessment'],
            value: totalScore, // Use score as a proxy for lead value
            currency: 'USD'
        });

        trackGA4Event('assessment_completed', {
            event_category: 'Lead Generation',
            event_label: `${sector}_${leadStatus}`,
            value: totalScore,
            custom_parameters: {
                sector: sector,
                lead_score: totalScore,
                commitment_level: commitment,
                compelling_event: finalAnswers[3]?.value
            }
        });

        setQuizResult(result);
        
        if (sector) {
            const urlParams = new URLSearchParams(window.location.search);
            HubSpot.upsertContact({
                ...finalUserData,
                session_user_id: sessionUserId.current,
                // Map answers to HubSpot custom properties
                pain_scale_score: finalAnswers[0]?.points,
                organization_size: finalAnswers[1]?.value,
                timeline_urgency: finalAnswers[2]?.value,
                compelling_event: finalAnswers[3]?.value,
                commitment_level: commitment,
                // System properties
                sector: sector,
                total_assessment_score: totalScore,
                lead_temperature: leadStatus,
                assessment_answers_json: JSON.stringify(finalAnswers),
                lifecyclestage: 'lead',
                source_url: window.location.href,
                utm_campaign: urlParams.get('utm_campaign') || undefined,
            });
        }
        
        if (commitment === 'exploring' || commitment === 'general_interest') {
            HubSpot.trackEvent('Buyer Guide Accessed', sessionUserId.current);
            setStep('buyersGuide');
        } else {
            setStep('confirmation');
        }
        setSubmissionStatus(null);
    };

    const handleReset = () => {
        HubSpot.clearSessionUserId(); // Start a fresh session
        localStorage.removeItem('tkcp_quiz_state'); // Clear saved progress
        window.location.search = ''; // Clears params and re-triggers detection
    };

    const renderContent = () => {
        if (submissionStatus) {
            return (
                <div className="flex flex-col justify-center items-center h-[60vh] text-center">
                    <Spinner />
                    <p key={submissionStatus} className="mt-4 text-lg text-gray-700 animate-fade-in-up">
                        {submissionStatus}
                    </p>
                </div>
            );
        }

        switch(step) {
            case 'loading':
                return <div className="flex justify-center items-center h-64"><Spinner /></div>;
            case 'landing':
                return <Landing onSectorSelect={handleSectorSelect} />;
            case 'quiz':
                 if (sector) {
                    return <Quiz sector={sector} onComplete={handleQuizComplete} />;
                 }
                 // This case should ideally not be reached due to the initial detection
                 return <div className="text-center">Loading assessment...</div>;
            case 'confirmation':
                if (quizResult && sector) {
                     return <Confirmation result={quizResult} onReset={handleReset} sector={sector} />;
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