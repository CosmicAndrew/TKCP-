import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Sector, LeadStatus, UserData, Answer, Result, GeminiInsights, Theme } from './types';
import { ASSESSMENT_QUESTIONS, calculateLeadTemperature, HUBSPOT_CONFIG } from './constants';
import * as HubSpot from './services/hubspot';
import Header from './components/Header';
import Landing from './components/Landing';
import Quiz from './components/Quiz';
import Results from './components/Results';
import Footer from './components/Footer';
import Spinner from './components/common/Spinner';
import CookieConsentBanner from './components/common/CookieConsentBanner';

// --- UTF-8 Safe Base64 Encoding/Decoding ---
const utf8ToBase64 = (str: string): string => {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode(parseInt(p1, 16));
        }
    ));
};

const base64ToUtf8 = (str: string): string => {
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
};

// --- Conversion Tracking Functions ---
const trackMetaEvent = (eventName: string, params: object = {}) => {
    console.log(`[Meta Pixel Event]: ${eventName}`, params);
    // window.fbq('track', eventName, params);
};

const trackGA4Event = (eventName: string, params: object = {}) => {
    console.log(`[Google Analytics 4 Event]: ${eventName}`, params);
    // window.gtag('event', eventName, params);
}

// --- Meta Tag Updater ---
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

// --- Dark Mode Hook ---
const useTheme = (): [Theme, () => void] => {
    const [theme, setTheme] = useState<Theme>(() => {
        const storedTheme = localStorage.getItem('theme') as Theme | null;
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return storedTheme || (systemPrefersDark ? 'dark' : 'light');
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
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
    const [step, setStep] = useState<'loading' | 'landing' | 'quiz' | 'results'>('loading');
    const [sector, setSector] = useState<Sector | null>(null);
    const [quizResult, setQuizResult] = useState<Result | null>(null);
    const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const sessionUserId = useRef<string>(HubSpot.getSessionUserId());
    const [theme, toggleTheme] = useTheme();

    useEffect(() => {
        console.log('🔍 AI Studio key (API_KEY) available:', !!process.env.API_KEY);
        trackMetaEvent('PageView');
        
        if (window.location.hash.startsWith('#results=')) {
            try {
                const encodedData = window.location.hash.substring(9);
                const decodedData = base64ToUtf8(encodedData);
                const resultData: Result = JSON.parse(decodedData);
                
                setQuizResult(resultData);
                setSector(resultData.sector);
                setStep('results');
                history.replaceState(null, document.title, window.location.pathname + window.location.search);
                return;
            } catch (e) {
                console.error("Failed to parse result data from URL hash", e);
                history.replaceState(null, document.title, window.location.pathname + window.location.search);
            }
        }
        
        const urlParams = new URLSearchParams(window.location.search);
        const sectorParam = (urlParams.get('sector') || urlParams.get('org') || '').toLowerCase();
        const utmCampaign = (urlParams.get('utm_campaign') || '').toLowerCase();

        let detectedSector: Sector | null = null;
        if (utmCampaign.includes('hospitality') || ['hospitality', 'venue', 'business'].includes(sectorParam)) {
            detectedSector = Sector.Hospitality;
        } else if (utmCampaign.includes('church') || ['church', 'worship', 'ministry'].includes(sectorParam)) {
            detectedSector = Sector.Church;
        }
        
        if (detectedSector) {
            console.log(`Detected Sector from URL: ${detectedSector}`);
            localStorage.setItem('tkcp_sector', detectedSector);
            setSector(detectedSector);
            setStep('quiz');
        } else {
            setStep('landing');
        }
    }, []);

    useEffect(() => {
        let title = 'Is an LED Screen Right for You? | TKCP Assessment';
        let description = 'Take our quick, free assessment to discover if an LED wall is the right investment for your church or venue. Get personalized recommendations from Thy Kingdom Come Productions.';

        if (step === 'quiz' && sector) {
            title = sector === Sector.Church 
                ? 'LED Screen Assessment for Churches | TKCP'
                : 'LED Screen Assessment for Venues & Businesses | TKCP';
            description = sector === Sector.Church
                ? 'Discover if an LED wall is the right investment for your house of worship. Answer a few questions to see how you can enhance your ministry\'s visual experience.'
                : 'Find out how an integrated LED screen can boost revenue and elevate events at your venue. Take the free TKCP assessment today.';
        } else if (step === 'results' && quizResult) {
            const leadStatusText = quizResult.leadStatus.charAt(0).toUpperCase() + quizResult.leadStatus.slice(1);
            title = `Your Assessment Results: ${leadStatusText} Lead | TKCP`;
            description = `Congratulations, ${quizResult.userData.firstName || 'friend'}! View your personalized LED screen assessment results and see your custom-tailored next steps.`;
        }

        updateMetaTags(title, description);
    }, [step, sector, quizResult]);

    const generatePersonalizedInsights = useCallback(async (finalScore: number, finalAnswers: { [key: number]: Answer }, finalSector: Sector): Promise<GeminiInsights> => {
        if (!process.env.API_KEY) {
            console.warn('⚠️ Gemini API key not configured. Using fallback insights.');
            return generateFallbackInsights(finalSector);
        }
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const formattedAnswers = ASSESSMENT_QUESTIONS.map((q, index) => {
                const answer = finalAnswers[index];
                if (!answer) return null;
                const option = q.options.find(o => o.value === answer.value);
                return { question: q.text(finalSector).replace(/<[^>]*>?/gm, ''), answer: option ? option.text[finalSector] : 'N/A', points: answer.points };
            }).filter(Boolean);

            const prompt = `
            You are an expert BANT (Budget, Authority, Need, Timeline) sales consultant for TKCP, a company selling high-end LED screens.
            A potential client from the '${finalSector === 'church' ? 'House of Worship' : 'Venue/Business'}' sector has completed a qualification assessment.
            Their final score is ${finalScore} out of 20. Their answers: ${JSON.stringify(formattedAnswers, null, 2)}
            
            Generate a response in JSON format with two keys:
            1. "summary": A brief (2-3 sentences), encouraging summary for the results page. Frame their situation positively.
            2. "actionable_steps": An array of exactly 3 short, actionable, encouraging next steps.
            
            The tone must be consultative, positive, and justify the next step. Do not use markdown.`;
            
            const response = await ai.models.generateContent({
                model: "gemini-2.5-pro", contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            summary: { type: Type.STRING, description: "A brief, encouraging summary for the user." },
                            actionable_steps: { type: Type.ARRAY, description: "An array of 3 actionable next steps.", items: { type: Type.STRING } }
                        },
                        required: ["summary", "actionable_steps"]
                    }
                }
            });
            
            const rawText = response.text.trim();
            const insights: GeminiInsights = JSON.parse(rawText);

            if (insights && insights.summary && Array.isArray(insights.actionable_steps) && insights.actionable_steps.length > 0) {
                console.log("✅ Generated and validated insights:", insights);
                return insights;
            } else {
                throw new Error("Parsed JSON does not match expected GeminiInsights schema.");
            }
        } catch (e: any) {
            console.error("🚨 AI Generation Error. Using fallback insights.", e);
            setError(`We had trouble generating AI insights, but your results are ready!`);
            return generateFallbackInsights(finalSector);
        }
    }, []);
    
    const handleSectorSelect = (selectedSector: Sector) => {
        trackMetaEvent('Lead', { sector: selectedSector });
        HubSpot.trackEvent('Selected Sector', sessionUserId.current, { sector: selectedSector });
        localStorage.setItem('tkcp_sector', selectedSector);
        setSector(selectedSector);
        setStep('quiz');
    };

    const sendFollowUpEmail = (result: Result) => {
        const { userData, score, maxScore, leadStatus, geminiInsights } = result;
        if (!userData.email) return;

        const resultDataString = JSON.stringify(result);
        const encodedResult = utf8ToBase64(resultDataString);
        const resultsUrl = `${window.location.origin}${window.location.pathname}#results=${encodedResult}`;

        const bookingUrl = new URL(HUBSPOT_CONFIG.meetingLinks.priority);
        if(userData.firstName) bookingUrl.searchParams.append('firstname', userData.firstName);
        if(userData.lastName) bookingUrl.searchParams.append('lastname', userData.lastName);
        bookingUrl.searchParams.append('email', userData.email);

        const leadStatusText = leadStatus.charAt(0).toUpperCase() + leadStatus.slice(1);
        const emailBody = `...`; // Email body removed for brevity
        console.log("--- SIMULATING FOLLOW-UP EMAIL ---");
    };

    const handleQuizComplete = async (finalAnswers: { [key: number]: Answer }, finalUserData: Partial<UserData>) => {
        if (!sector) return;
        setError(null);
        setSubmissionStatus('Analyzing your results...');
        
        const totalScore = (Object.values(finalAnswers) as Answer[]).reduce((sum, answer) => sum + answer.points, 0);
        const leadStatus = calculateLeadTemperature(totalScore);

        setSubmissionStatus('Our AI expert is crafting your personalized insights...');
        const insights = await generatePersonalizedInsights(totalScore, finalAnswers, sector);
        
        setSubmissionStatus('Saving your assessment...');
        
        const result: Result = { 
            userData: finalUserData, leadStatus, score: totalScore, 
            answers: finalAnswers, maxScore: 20, sector, geminiInsights: insights
        };
        
        sendFollowUpEmail(result);

        trackGA4Event('assessment_completed', {
            event_category: 'Lead Generation', event_label: `${sector}_${leadStatus}`, value: totalScore,
        });

        setQuizResult(result);
        
        if (finalUserData.email) {
            try {
                const urlParams = new URLSearchParams(window.location.search);
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
                    utm_campaign: urlParams.get('utm_campaign') || undefined,
                });
                console.log("✅ HubSpot contact submission process completed.");
            } catch (hubspotError) {
                console.error("🚨 HubSpot submission failed, but the user flow will continue gracefully.", hubspotError);
            }
        } else {
             console.log("[App] Skipping HubSpot submission for now. Contact info will be collected later.");
        }
        
        setStep('results');
        setSubmissionStatus(null);
    };

    const handleReset = () => {
        HubSpot.clearSessionUserId();
        localStorage.removeItem('tkcp_quiz_state');
        window.location.href = window.location.pathname;
    };

    const renderContent = () => {
        if (submissionStatus) {
            return (
                <div role="status" className="flex flex-col justify-center items-center h-[60vh] text-center">
                    <Spinner />
                    <p key={submissionStatus} className="mt-4 text-lg text-gray-700 dark:text-gray-300 animate-fade-in-up">
                        {submissionStatus}
                    </p>
                    {error && (
                         <div className="mt-4 text-red-500">{error}</div>
                    )}
                </div>
            );
        }

        switch(step) {
            case 'loading':
                return <div className="flex justify-center items-center h-64"><Spinner /></div>;
            case 'landing':
                return <Landing onSectorSelect={handleSectorSelect} theme={theme} />;
            case 'quiz':
                 return sector ? <Quiz sector={sector} onComplete={handleQuizComplete} /> : <div className="text-center">Loading assessment...</div>;
            case 'results':
                return quizResult && sector ? <Results result={quizResult} onReset={handleReset} sector={sector} /> : <div className="flex justify-center items-center h-64"><Spinner /></div>;
            default:
                 return <div className="flex justify-center items-center h-64"><Spinner /></div>;
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
