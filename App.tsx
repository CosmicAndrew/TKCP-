
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Sector, LeadStatus, UserData, Answer, Result, GeminiInsights, Theme } from './types';
import { ASSESSMENT_QUESTIONS, calculateLeadTemperature, HUBSPOT_CONFIG } from './constants';
import * as HubSpot from './services/hubspot';
import Header from './components/Header';
import Landing from './components/Landing';
import Quiz from './components/Quiz';
import Confirmation from './components/Confirmation';
import BuyersGuide from './components/BuyersGuide';
import Footer from './components/Footer';
import Spinner from './components/common/Spinner';
import CookieConsentBanner from './components/common/CookieConsentBanner';

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

// --- Meta Tag Updater ---
const updateMetaTags = (title: string, description: string) => {
    document.title = title;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', description);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
        ogTitle.setAttribute('content', title);
    }
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
        ogDescription.setAttribute('content', description);
    }

    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    if (twitterTitle) {
        twitterTitle.setAttribute('content', title);
    }
    const twitterDescription = document.querySelector('meta[property="twitter:description"]');
    if (twitterDescription) {
        twitterDescription.setAttribute('content', description);
    }
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

/**
 * Generates generic, high-quality fallback insights if the Gemini API is unavailable.
 * @param sector The user's selected sector (Church or Hospitality).
 * @returns A GeminiInsights object with fallback content.
 */
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
    const [step, setStep] = useState<'loading' | 'landing' | 'quiz' | 'confirmation' | 'buyersGuide'>('loading');
    const [sector, setSector] = useState<Sector | null>(null);
    const [quizResult, setQuizResult] = useState<Result | null>(null);
    const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const sessionUserId = useRef<string>(HubSpot.getSessionUserId());
    const [theme, toggleTheme] = useTheme();
    const quizCompletionData = useRef<{ answers: { [key: number]: Answer }, userData: Partial<UserData> } | null>(null);


    useEffect(() => {
        // --- DEBUGGING ENV VARS ---
        console.log('🔍 AI Studio key (API_KEY) available:', !!process.env.API_KEY);
        // --- END DEBUGGING ---

        trackMetaEvent('PageView');
        
        // Check for results data in URL hash first
        if (window.location.hash.startsWith('#results=')) {
            try {
                const encodedData = window.location.hash.substring(9); // remove #results=
                const decodedData = atob(encodedData);
                const resultData: Result = JSON.parse(decodedData);
                
                setQuizResult(resultData);
                setSector(resultData.sector);
                setStep('confirmation');
                // Clean the hash to avoid re-triggering and clean up URL
                history.replaceState(null, document.title, window.location.pathname + window.location.search);
                return;
            } catch (e) {
                console.error("Failed to parse result data from URL hash", e);
                // Fallback to normal flow if parsing fails
                history.replaceState(null, document.title, window.location.pathname + window.location.search);
            }
        }
        
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

     // --- Dynamic Meta Tag Updates ---
    useEffect(() => {
        let title = 'Is an LED Screen Right for You? | TKCP Assessment';
        let description = 'Take our quick, free assessment to discover if an LED wall is the right investment for your church or venue. Get personalized recommendations from Thy Kingdom Come Productions.';

        if (step === 'quiz' && sector) {
            if (sector === Sector.Church) {
                title = 'LED Screen Assessment for Churches | TKCP';
                description = 'Discover if an LED wall is the right investment for your house of worship. Answer a few questions to see how you can enhance your ministry\'s visual experience.';
            } else {
                title = 'LED Screen Assessment for Venues & Businesses | TKCP';
                description = 'Find out how an integrated LED screen can boost revenue and elevate events at your venue. Take the free TKCP assessment today.';
            }
        } else if ((step === 'confirmation' || step === 'buyersGuide') && quizResult) {
            const leadStatusText = quizResult.leadStatus.charAt(0).toUpperCase() + quizResult.leadStatus.slice(1);
            title = `Your Assessment Results: ${leadStatusText} Lead | TKCP`;
            description = `Congratulations, ${quizResult.userData.firstName || 'friend'}! View your personalized LED screen assessment results and see your custom-tailored next steps.`;
        }

        updateMetaTags(title, description);
    }, [step, sector, quizResult]);

    const generatePersonalizedInsights = useCallback(async (finalScore: number, finalAnswers: { [key: number]: Answer }, finalSector: Sector): Promise<GeminiInsights> => {
        const apiKey = process.env.API_KEY;
        
        console.log('🔍 DEBUG: Starting AI generation');
        console.log('🔍 API Key source: API_KEY');
        console.log('🔍 API Key exists:', !!apiKey);

        if (!apiKey) {
            console.warn('⚠️ Gemini API key not configured. Using fallback insights.');
            return generateFallbackInsights(finalSector);
        }

        try {
            console.log('🔍 Initializing GoogleGenAI...');
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
            You are an expert BANT (Budget, Authority, Need, Timeline) sales consultant for TKCP, a company selling high-end LED screens.
            A potential client from the '${finalSector === 'church' ? 'House of Worship' : 'Venue/Business'}' sector has completed a qualification assessment.
            Their final score is ${finalScore} out of 20.
            Their answers: ${JSON.stringify(formattedAnswers, null, 2)}
            
            Based on this, generate a response in JSON format. The JSON object must have two keys:
            1. "summary": A brief (2-3 sentences), encouraging summary for the user's results page. Frame their situation positively.
            2. "actionable_steps": An array of exactly 3 short, actionable, and encouraging next steps for the user.
            
            The tone must be consultative, positive, and justify taking the next step. Do not use markdown.
            `;
            
            console.log('🔍 Generating content with model: gemini-2.5-flash');
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
            
            console.log('🔍 AI Response received. Attempting to parse...');
            let rawText = response.text.trim();

            // Attempt to clean up markdown code block fences if they exist
            if (rawText.startsWith('```json')) {
                rawText = rawText.substring(7, rawText.length - 3).trim();
            } else if (rawText.startsWith('```')) {
                rawText = rawText.substring(3, rawText.length - 3).trim();
            }

            let insights: GeminiInsights;

            try {
                const parsedJson = JSON.parse(rawText);

                // Validate the structure of the parsed JSON
                if (
                    parsedJson &&
                    typeof parsedJson.summary === 'string' && parsedJson.summary.length > 0 &&
                    Array.isArray(parsedJson.actionable_steps) &&
                    parsedJson.actionable_steps.length > 0 &&
                    parsedJson.actionable_steps.every((step: any) => typeof step === 'string')
                ) {
                    insights = parsedJson;
                    console.log("✅ Generated and validated insights:", insights);
                } else {
                    console.error("🚨 AI Response validation failed. Parsed JSON does not match expected schema:", parsedJson);
                    throw new Error("Parsed JSON does not match expected GeminiInsights schema.");
                }

            } catch (parsingError) {
                console.error("🚨 Failed to parse or validate AI response.", {
                    rawText: rawText,
                    error: parsingError
                });
                // The outer catch will handle this and use the fallback.
                throw parsingError; 
            }
            
            HubSpot.upsertContact({
                session_user_id: sessionUserId.current,
                gemini_followup_insights: JSON.stringify(insights, null, 2),
            });

            return insights;

        } catch (e: any) {
            console.error("🚨 AI Generation Error. Using fallback insights.", e);
            return generateFallbackInsights(finalSector);
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

    const sendFollowUpEmail = (result: Result) => {
        const { userData, score, maxScore, leadStatus, geminiInsights, sector } = result;
        if (!userData.email) {
            console.log("No email provided, skipping follow-up email.");
            return;
        }

        // Generate results link
        const resultDataString = JSON.stringify(result);
        const encodedResult = btoa(resultDataString);
        const resultsUrl = `${window.location.origin}${window.location.pathname}#results=${encodedResult}`;

        // Generate pre-filled booking link
        const bookingUrl = new URL(HUBSPOT_CONFIG.meetingLinks.priority);
        if(userData.firstName) bookingUrl.searchParams.append('firstname', userData.firstName);
        if(userData.lastName) bookingUrl.searchParams.append('lastname', userData.lastName);
        bookingUrl.searchParams.append('email', userData.email);
        bookingUrl.searchParams.append('utm_source', 'assessment_email');
        bookingUrl.searchParams.append('utm_medium', 'email');
        bookingUrl.searchParams.append('utm_campaign', 'q4_led_screens_followup');

        const leadStatusText = leadStatus.charAt(0).toUpperCase() + leadStatus.slice(1);

        const emailBody = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <h2 style="color: #2B4C7E;">Your LED Screen Assessment Results - ${leadStatusText} Lead</h2>
            <p>Hi ${userData.firstName || 'there'},</p>
            <p>Thank you for completing the LED Assessment with Thy Kingdom Come Productions! Here is a summary of your results and personalized next steps.</p>
            
            <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Your Score: ${score}/${maxScore} (${leadStatusText})</h3>
                <p><strong>Top AI Insights for You:</strong></p>
                <ul style="padding-left: 20px;">
                    ${geminiInsights?.actionable_steps.slice(0, 2).map(step => `<li>${step}</li>`).join('') || ''}
                </ul>
            </div>

            <p>For a detailed breakdown and your complete set of recommendations, please view your full results page:</p>
            <a href="${resultsUrl}" style="display: inline-block; background-color: #D4AF37; color: #000; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Full Results</a>

            <p style="margin-top: 25px;">Ready to discuss your LED screen solution and see how we can bring your vision to life?</p>
            <a href="${bookingUrl.toString()}" style="display: inline-block; background-color: #2B4C7E; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Schedule Your Free Consultation</a>
            
            <hr style="margin-top: 30px; border: 0; border-top: 1px solid #ddd;" />
            <p style="font-size: 12px; color: #777;">
                Join 500+ churches who upgraded to LED. <br />
                Thy Kingdom Come Productions | (469) 840-9808
            </p>
        </div>
        `;

        const email = {
            to: userData.email,
            subject: `Your LED Screen Assessment Results - ${leadStatusText} Lead`,
            body: emailBody.trim(),
        };

        console.log("--- SIMULATING FOLLOW-UP EMAIL ---");
        console.log(email);
        console.log("---------------------------------");
    };

    const processQuizCompletion = async () => {
        if (!quizCompletionData.current || !sector) return;
        const { answers: finalAnswers, userData: finalUserData } = quizCompletionData.current;

        setError(null); // Reset error on each attempt
        setSubmissionStatus('Analyzing your results...');
        await new Promise(res => setTimeout(res, 1000));
        
        const totalScore = (Object.values(finalAnswers) as Answer[]).reduce((sum, answer) => sum + answer.points, 0);
        const leadStatus = calculateLeadTemperature(totalScore);
        const maxScore = 20;

        setSubmissionStatus('Our AI expert is crafting your personalized insights...');
        // This call is now resilient: it will return real insights or a fallback, but won't throw an error for API issues.
        const insights = await generatePersonalizedInsights(totalScore, finalAnswers, sector);
        
        setSubmissionStatus('Tailoring your recommendations...');
        await new Promise(res => setTimeout(res, 1000));

        const result: Result = { 
            userData: finalUserData, 
            leadStatus, 
            score: totalScore, 
            answers: finalAnswers,
            maxScore,
            sector,
            geminiInsights: insights ?? undefined
        };
        
        sendFollowUpEmail(result);

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
        
        if (commitment === 'exploring') {
            HubSpot.trackEvent('Buyer Guide Accessed', sessionUserId.current);
            setStep('buyersGuide');
        } else {
            setStep('confirmation');
        }
        setSubmissionStatus(null);
    };

    const handleQuizComplete = async (finalAnswers: { [key: number]: Answer }, finalUserData: Partial<UserData>) => {
        quizCompletionData.current = { answers: finalAnswers, userData: finalUserData };
        await processQuizCompletion();
    };

    const handleReset = () => {
        HubSpot.clearSessionUserId(); // Start a fresh session
        localStorage.removeItem('tkcp_quiz_state'); // Clear saved progress
        window.location.href = window.location.pathname; // Clears params and hash, re-triggers detection
    };

    const renderContent = () => {
        if (submissionStatus) {
            // Error block is kept for non-API related errors, but will not trigger on API failure anymore.
            if (error) {
                return (
                    <div className="flex flex-col justify-center items-center h-[60vh] text-center">
                        <div className="text-red-500 mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-md">
                            <h3 className="font-bold text-lg">Oops! Something went wrong.</h3>
                            <p className="mt-1">{error}</p>
                        </div>
                        <button
                            onClick={processQuizCompletion}
                            className="px-6 py-2 bg-church-primary text-white font-semibold rounded-md hover:bg-church-primary/90 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                );
            }
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
            case 'loading':
                return <div className="flex justify-center items-center h-64"><Spinner /></div>;
            case 'landing':
                return <Landing onSectorSelect={handleSectorSelect} theme={theme} />;
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
                 // Fallback to prevent state update during render
                 return <div className="flex justify-center items-center h-64"><Spinner /></div>;
            case 'buyersGuide':
                if (quizResult && sector) {
                    return <BuyersGuide result={quizResult} sector={sector} onReset={handleReset} />;
                }
                // Fallback to prevent state update during render
                return <div className="flex justify-center items-center h-64"><Spinner /></div>;
            default:
                 // Fallback to prevent state update during render
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
