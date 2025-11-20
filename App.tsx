
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Sector, LeadStatus, UserData, Answer, Result, GeminiInsights, Theme } from './types';
import { ASSESSMENT_QUESTIONS, calculateLeadTemperature, HUBSPOT_CONFIG, LOCAL_STORAGE_KEYS } from './constants';
import * as HubSpot from './services/hubspot';
import { base64ToUtf8, utf8ToBase64 } from './utils';
import { trackMetaEvent, trackGA4Event } from './services/tracking';
import Header from './components/Header';
import Landing from './components/Landing';
import Quiz from './components/Quiz';
import HotLeadResult from './components/Confirmation';
import WarmLeadResult from './components/Results';
import ColdLeadResult from './components/ColdLeadResult';
import BuyersGuide from './components/BuyersGuide';
import Footer from './components/Footer';
import Spinner from './components/common/Spinner';
import CookieConsentBanner from './components/common/CookieConsentBanner';

const updateMetaTags = (title: string, description: string) => {
    document.title = title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute('content', description);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', description);
    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', title);
    const twitterDescription = document.querySelector('meta[property="twitter:description"]');
    if (twitterDescription) twitterDescription.setAttribute('content', description);
};

const useTheme = (): [Theme, () => void] => {
    const [theme, setTheme] = useState<Theme>(() => {
        const storedTheme = localStorage.getItem(LOCAL_STORAGE_KEYS.theme) as Theme | null;
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return storedTheme || (systemPrefersDark ? 'dark' : 'light');
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
            localStorage.setItem(LOCAL_STORAGE_KEYS.theme, 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem(LOCAL_STORAGE_KEYS.theme, 'light');
        }
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    }, []);

    return [theme, toggleTheme];
};

const generateFallbackInsights = (sector: Sector): GeminiInsights => {
    const sectorName = sector === 'church' ? 'House of Worship' : 'Venue/Business';
    return {
        summary: `Based on your assessment for your ${sectorName}, it's clear you're evaluating significant upgrades. Our analysis indicates a strong potential for enhancing your visual experience and engagement.`,
        actionable_steps: [
            `Schedule a consultation to discuss your specific LED needs for your ${sectorName}.`,
            `Review our portfolio of projects similar to your ${sectorName}.`,
            "Request a custom quote based on your unique requirements and space."
        ]
    };
};

const App: React.FC = () => {
    const [step, setStep] = useState<'loading' | 'landing' | 'quiz' | 'hotResult' | 'warmResult' | 'coldResult' | 'buyersGuide'>('loading');
    const [sector, setSector] = useState<Sector | null>(null);
    const [quizResult, setQuizResult] = useState<Result | null>(null);
    const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const sessionUserId = useRef<string>(HubSpot.getSessionUserId());
    const [theme, toggleTheme] = useTheme();
    const quizCompletionData = useRef<{ answers: { [key: number]: Answer }, userData: Partial<UserData> } | null>(null);
    const [guideEntrypoint, setGuideEntrypoint] = useState<'quiz' | 'results'>('quiz');

    useEffect(() => {
        trackMetaEvent('PageView');
        const urlParams = new URLSearchParams(window.location.search);
        const resultsParam = urlParams.get('results');

        if (resultsParam) {
            try {
                const decodedData = base64ToUtf8(resultsParam);
                const resultData: Result = JSON.parse(decodedData);
                setQuizResult(resultData);
                setSector(resultData.sector);
                if (resultData.leadStatus === 'hot') setStep('hotResult');
                else if (resultData.leadStatus === 'warm') setStep('warmResult');
                else setStep('coldResult');
                urlParams.delete('results');
                const newSearch = urlParams.toString();
                const newUrl = `${window.location.pathname}${newSearch ? `?${newSearch}` : ''}`;
                history.replaceState(null, document.title, newUrl);
                return;
            } catch (e) {
                console.error("Failed to parse result data from URL query param", e);
                urlParams.delete('results');
                history.replaceState(null, document.title, window.location.pathname);
            }
        }
        
        if (window.location.hash.startsWith('#results=')) {
            try {
                const encodedData = window.location.hash.substring(9);
                const decodedData = base64ToUtf8(encodedData);
                const resultData: Result = JSON.parse(decodedData);
                setQuizResult(resultData);
                setSector(resultData.sector);
                if (resultData.leadStatus === 'hot') setStep('hotResult');
                else if (resultData.leadStatus === 'warm') setStep('warmResult');
                else setStep('coldResult');
                history.replaceState(null, document.title, window.location.pathname + window.location.search);
                return;
            } catch (e) {
                console.error("Failed to parse result data from URL hash", e);
                history.replaceState(null, document.title, window.location.pathname + window.location.search);
            }
        }
        
        const sectorParam = (urlParams.get('sector') || urlParams.get('org') || '').toLowerCase();
        const utmCampaign = (urlParams.get('utm_campaign') || '').toLowerCase();
        let detectedSector: Sector | null = null;
        if (utmCampaign.includes('hospitality') || sectorParam === 'hospitality' || sectorParam === 'venue' || sectorParam === 'business') {
            detectedSector = Sector.Hospitality;
        } else if (utmCampaign.includes('church') || sectorParam === 'church' || sectorParam === 'worship' || sectorParam === 'ministry') {
            detectedSector = Sector.Church;
        }
        
        if (detectedSector) {
            localStorage.setItem(LOCAL_STORAGE_KEYS.sector, detectedSector);
            setSector(detectedSector);
            setStep('quiz');
        } else {
            setStep('landing');
        }
    }, []);

    useEffect(() => {
        let title = 'Is an LED Screen Right for You? | TKCP Assessment';
        let description = 'Take our quick, free assessment to discover if an LED wall is the right investment for your church or venue.';
        if (step === 'quiz' && sector) {
            if (sector === Sector.Church) {
                title = 'LED Screen Assessment for Churches | TKCP';
                description = 'Discover if an LED wall is the right investment for your house of worship.';
            } else {
                title = 'LED Screen Assessment for Venues & Businesses | TKCP';
                description = 'Find out how an integrated LED screen can boost revenue and elevate events.';
            }
        } else if (step.includes('Result') && quizResult) {
            const leadStatusText = quizResult.leadStatus.charAt(0).toUpperCase() + quizResult.leadStatus.slice(1);
            title = `Your Assessment Results: ${leadStatusText} Lead | TKCP`;
            description = `Congratulations, ${quizResult.userData.firstName || 'friend'}! View your personalized LED screen assessment results.`;
        }
        updateMetaTags(title, description);
    }, [step, sector, quizResult]);

    const generatePersonalizedInsights = useCallback(async (finalScore: number, finalAnswers: { [key: number]: Answer }, finalSector: Sector): Promise<GeminiInsights> => {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            return generateFallbackInsights(finalSector);
        }

        try {
            const ai = new GoogleGenAI({ apiKey });
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
            You are an expert BANT sales consultant for TKCP, selling LED screens.
            Sector: ${finalSector === 'church' ? 'House of Worship' : 'Venue/Business'}.
            Score: ${finalScore}/20.
            Answers: ${JSON.stringify(formattedAnswers)}
            
            Generate a JSON response with:
            1. "summary": Brief (2-3 sentences) encouraging summary.
            2. "actionable_steps": Array of 3 short, actionable next steps.
            `;
            
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            summary: { type: Type.STRING },
                            actionable_steps: { type: Type.ARRAY, items: { type: Type.STRING } }
                        },
                        required: ["summary", "actionable_steps"]
                    },
                }
            });
            
            const rawText = response.text.trim();
            const insights = JSON.parse(rawText);
            return insights;
        } catch (e: any) {
            console.error("AI Generation Error:", e);
            return generateFallbackInsights(finalSector);
        }
    }, []);
    
    const handleSectorSelect = (selectedSector: Sector) => {
        trackMetaEvent('Lead', { sector: selectedSector });
        HubSpot.trackBehavioralEvent('Selected Sector', { sector: selectedSector });
        localStorage.setItem(LOCAL_STORAGE_KEYS.sector, selectedSector);
        setSector(selectedSector);
        setStep('quiz');
    };

    const processQuizCompletion = async () => {
        if (!quizCompletionData.current || !sector) return;
        const { answers: finalAnswers, userData: finalUserData } = quizCompletionData.current;

        setError(null);
        setSubmissionStatus('Analyzing your results...');
        await new Promise(res => setTimeout(res, 500));
        
        const totalScore = (Object.values(finalAnswers) as Answer[]).reduce((sum, answer) => sum + answer.points, 0);
        const leadStatus = calculateLeadTemperature(totalScore);
        const maxScore = 20;

        setSubmissionStatus('Our AI expert is crafting your personalized insights...');
        const insights = await generatePersonalizedInsights(totalScore, finalAnswers, sector);
        
        setSubmissionStatus('Saving your assessment...');
        await new Promise(res => setTimeout(res, 500));

        const result: Result = { 
            userData: finalUserData, 
            leadStatus, 
            score: totalScore, 
            answers: finalAnswers,
            maxScore,
            sector,
            geminiInsights: insights ?? undefined
        };
        
        trackMetaEvent('InitiateCheckout', { content_type: 'assessment', value: totalScore });
        trackGA4Event('assessment_completed', { value: totalScore });
        setQuizResult(result);
        
        if (finalUserData.email) {
            try {
                await HubSpot.upsertContact({
                    ...finalUserData,
                    session_user_id: sessionUserId.current,
                    pain_scale_score: finalAnswers[0]?.points,
                    organization_size: finalAnswers[1]?.value,
                    timeline_urgency: finalAnswers[2]?.value,
                    compelling_event: finalAnswers[3]?.value,
                    commitment_level: finalAnswers[4]?.value,
                    sector: sector,
                    total_assessment_score: totalScore,
                    lead_temperature: leadStatus,
                    assessment_answers_json: JSON.stringify(finalAnswers),
                    gemini_followup_insights: JSON.stringify(insights, null, 2),
                    lifecyclestage: 'lead',
                    source_url: window.location.href,
                });
            } catch (hubspotError) {
                console.error("HubSpot submission warning:", hubspotError);
            }
        }
        
        setGuideEntrypoint('quiz');

        if (leadStatus === 'hot') {
            HubSpot.trackBehavioralEvent('Hot Lead Results Page Viewed', { lead_status: leadStatus });
            setStep('hotResult');
        } else if (leadStatus === 'warm') {
            HubSpot.trackBehavioralEvent('Warm Lead Directed to Buyer Guide', { lead_status: leadStatus });
            setStep('buyersGuide');
        } else {
            HubSpot.trackBehavioralEvent('Cold Lead Directed to Buyer Guide', { lead_status: leadStatus });
            setStep('buyersGuide');
        }
        setSubmissionStatus(null);
    };

    const handleQuizComplete = async (finalAnswers: { [key: number]: Answer }, finalUserData: Partial<UserData>) => {
        quizCompletionData.current = { answers: finalAnswers, userData: finalUserData };
        await processQuizCompletion();
    };

    const handleReset = () => {
        HubSpot.clearSessionUserId();
        localStorage.removeItem(LOCAL_STORAGE_KEYS.quizState);
        window.location.href = window.location.pathname;
    };

    const handleNavigateToGuide = () => {
        HubSpot.trackBehavioralEvent('Buyer Guide Accessed from Results', { lead_status: quizResult?.leadStatus });
        setGuideEntrypoint('results');
        setStep('buyersGuide');
    }

    const handleGuideComplete = () => {
        if (quizResult) {
            setGuideEntrypoint('results');
            switch (quizResult.leadStatus) {
                case 'warm': setStep('warmResult'); break;
                case 'cold': setStep('coldResult'); break;
                default: setStep('hotResult'); break;
            }
        } else {
            handleReset();
        }
    };

    const handleBackToResults = () => {
        if (quizResult) {
            switch (quizResult.leadStatus) {
                case 'hot': setStep('hotResult'); break;
                case 'warm': setStep('warmResult'); break;
                case 'cold': setStep('coldResult'); break;
            }
        } else {
            handleReset();
        }
    };

    const renderContent = () => {
        if (submissionStatus) {
            return (
                <div role="status" className="flex flex-col justify-center items-center h-[60vh] text-center">
                    <Spinner />
                    <p key={submissionStatus} className="mt-4 text-lg text-gray-700 dark:text-gray-300 animate-fade-in-up">
                        {submissionStatus}
                    </p>
                </div>
            );
        }

        switch(step) {
            case 'loading': return <div className="flex justify-center items-center h-64"><Spinner /></div>;
            case 'landing': return <Landing onSectorSelect={handleSectorSelect} theme={theme} />;
            case 'quiz': return sector ? <Quiz sector={sector} onComplete={handleQuizComplete} /> : <div>Loading...</div>;
            case 'hotResult': return (quizResult && sector) ? <HotLeadResult result={quizResult} onReset={handleReset} sector={sector} onNavigateToGuide={handleNavigateToGuide} /> : <Spinner />;
            case 'warmResult': return (quizResult && sector) ? <WarmLeadResult result={quizResult} onReset={handleReset} sector={sector} onNavigateToGuide={handleNavigateToGuide} /> : <Spinner />;
            case 'coldResult': return (quizResult && sector) ? <ColdLeadResult result={quizResult} onReset={handleReset} sector={sector} onNavigateToGuide={handleNavigateToGuide} /> : <Spinner />;
            case 'buyersGuide': return (quizResult && sector) ? <BuyersGuide result={quizResult} sector={sector} onReset={handleReset} onBackToResults={handleBackToResults} onGuideComplete={handleGuideComplete} guideEntrypoint={guideEntrypoint} /> : <Spinner />;
            default: return <Spinner />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-neutral-light dark:bg-gray-900">
            <Header theme={theme} toggleTheme={toggleTheme} />
            <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
                {renderContent()}
            </main>
            <Footer />
            <CookieConsentBanner />
        </div>
    );
};

export default App;
