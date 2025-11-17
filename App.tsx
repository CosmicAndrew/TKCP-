
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
import HotLeadResult from './components/Confirmation'; // Re-purposed for Hot Leads
import WarmLeadResult from './components/Results'; // Re-purposed for Warm Leads
import ColdLeadResult from './components/ColdLeadResult'; // New component for Cold Leads
import BuyersGuide from './components/BuyersGuide';
import Footer from './components/Footer';
import Spinner from './components/common/Spinner';
import CookieConsentBanner from './components/common/CookieConsentBanner';

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
        // --- DEBUGGING ENV VARS ---
        console.log('🔍 AI Studio key (API_KEY) available:', !!process.env.API_KEY);
        // --- END DEBUGGING ---

        trackMetaEvent('PageView');
        
        const urlParams = new URLSearchParams(window.location.search);
        const resultsParam = urlParams.get('results');

        // PRIORITY 1: Check for results data in URL query parameter
        if (resultsParam) {
            try {
                const decodedData = base64ToUtf8(resultsParam);
                const resultData: Result = JSON.parse(decodedData);
                
                setQuizResult(resultData);
                setSector(resultData.sector);
                
                // Route to correct page based on stored result
                if (resultData.leadStatus === 'hot') {
                    setStep('hotResult');
                } else if (resultData.leadStatus === 'warm') {
                    setStep('warmResult');
                } else {
                    setStep('coldResult');
                }

                // Clean the 'results' query param from the URL to avoid re-processing
                urlParams.delete('results');
                const newSearch = urlParams.toString();
                const newUrl = `${window.location.pathname}${newSearch ? `?${newSearch}` : ''}`;
                history.replaceState(null, document.title, newUrl);
                return; // Stop further processing
            } catch (e) {
                console.error("Failed to parse result data from URL query param", e);
                // Fallback to normal flow if parsing fails, after cleaning the URL
                urlParams.delete('results');
                const newSearch = urlParams.toString();
                const newUrl = `${window.location.pathname}${newSearch ? `?${newSearch}` : ''}`;
                history.replaceState(null, document.title, newUrl);
            }
        }
        
        // PRIORITY 2: Check for results data in URL hash (legacy support)
        if (window.location.hash.startsWith('#results=')) {
            try {
                const encodedData = window.location.hash.substring(9); // remove #results=
                const decodedData = base64ToUtf8(encodedData);
                const resultData: Result = JSON.parse(decodedData);
                
                setQuizResult(resultData);
                setSector(resultData.sector);
                
                // Route to correct page based on stored result
                if (resultData.leadStatus === 'hot') {
                    setStep('hotResult');
                } else if (resultData.leadStatus === 'warm') {
                    setStep('warmResult');
                } else {
                    setStep('coldResult');
                }

                // Clean the hash to avoid re-triggering and clean up URL
                history.replaceState(null, document.title, window.location.pathname + window.location.search);
                return;
            } catch (e) {
                console.error("Failed to parse result data from URL hash", e);
                // Fallback to normal flow if parsing fails
                history.replaceState(null, document.title, window.location.pathname + window.location.search);
            }
        }
        
        // PRIORITY 3: Auto-detect sector from URL parameters to allow direct links to quiz
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
            localStorage.setItem(LOCAL_STORAGE_KEYS.sector, detectedSector); // Persist for HubSpot service
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
        } else if (step.includes('Result') && quizResult) {
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
                    },
                    thinkingConfig: { thinkingBudget: 24576 }
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
            
            return insights;

        } catch (e: any) {
            console.error("🚨 AI Generation Error. Using fallback insights.", e);
            setError(`We had trouble generating AI insights, but your results are ready! Error: ${e.message}`);
            return generateFallbackInsights(finalSector);
        }
    }, []);
    
    const handleSectorSelect = (selectedSector: Sector) => {
        trackMetaEvent('Lead', { sector: selectedSector });
        HubSpot.trackEvent('Selected Sector', sessionUserId.current, { sector: selectedSector });
        console.log(`Selected Sector: ${selectedSector}`);
        localStorage.setItem(LOCAL_STORAGE_KEYS.sector, selectedSector); // Persist for HubSpot service
        setSector(selectedSector);
        setStep('quiz');
    };

    const sendFollowUpEmail = (result: Result) => {
        const { userData, score, maxScore, leadStatus, geminiInsights } = result;
        if (!userData.email) {
            console.log("No email provided, skipping follow-up email.");
            return;
        }

        const resultDataString = JSON.stringify(result);
        const encodedResult = utf8ToBase64(resultDataString);
        const resultsUrl = `${window.location.origin}${window.location.pathname}?results=${encodedResult}`;

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
                Thy Kingdom Come Productions | <a href="tel:+18179529202" style="color: #777; text-decoration: none;">817-952-9202</a>
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
        await new Promise(res => setTimeout(res, 500)); // Short delay for UX
        
        const totalScore = (Object.values(finalAnswers) as Answer[]).reduce((sum, answer) => sum + answer.points, 0);
        const leadStatus = calculateLeadTemperature(totalScore);
        const maxScore = 20;

        setSubmissionStatus('Our AI expert is crafting your personalized insights...');
        const insights = await generatePersonalizedInsights(totalScore, finalAnswers, sector);
        
        setSubmissionStatus('Saving your assessment...');
        await new Promise(res => setTimeout(res, 500)); // Short delay for UX

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
                commitment_level: finalAnswers[4]?.value,
                compelling_event: finalAnswers[3]?.value
            }
        });

        setQuizResult(result);
        
        const urlParams = new URLSearchParams(window.location.search);
        
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
                    utm_campaign: urlParams.get('utm_campaign') || undefined,
                });
                console.log("✅ HubSpot contact submission process completed.");
            } catch (hubspotError) {
                console.error("🚨 HubSpot submission failed, but the user flow will continue gracefully.", hubspotError);
            }
        } else {
             console.log("[App] Skipping HubSpot submission for now. Contact info will be collected in the Buyer's Guide.");
        }
        
        setGuideEntrypoint('quiz'); // Reset entrypoint on new submission

        // --- UPDATED ROUTING LOGIC ---
        if (leadStatus === 'hot') {
            HubSpot.trackEvent('Hot Lead Results Page Viewed', sessionUserId.current, { lead_status: leadStatus });
            setStep('hotResult');
        } else if (leadStatus === 'warm') {
            HubSpot.trackEvent('Warm Lead Directed to Buyer Guide', sessionUserId.current, { lead_status: leadStatus });
            setStep('buyersGuide');
        } else { // cold
            HubSpot.trackEvent('Cold Lead Directed to Buyer Guide', sessionUserId.current, { lead_status: leadStatus });
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
        HubSpot.trackEvent('Buyer Guide Accessed from Results', sessionUserId.current, { lead_status: quizResult?.leadStatus });
        setGuideEntrypoint('results');
        setStep('buyersGuide');
    }

    const handleGuideComplete = () => {
        if (quizResult) {
            setGuideEntrypoint('results'); // Mark that they've seen the guide and are now heading to results
            switch (quizResult.leadStatus) {
                case 'warm':
                    setStep('warmResult');
                    break;
                case 'cold':
                    setStep('coldResult');
                    break;
                default:
                    // If a hot lead somehow goes through the guide, send them to their results
                    setStep('hotResult');
                    break;
            }
        } else {
            // Fallback if state is lost
            handleReset();
        }
    };


    const handleBackToResults = () => {
        if (quizResult) {
            switch (quizResult.leadStatus) {
                case 'hot':
                    setStep('hotResult');
                    break;
                case 'warm':
                    setStep('warmResult');
                    break;
                case 'cold':
                    // FIX: Allow cold leads to navigate back to their results page from the guide.
                    setStep('coldResult');
                    break;
            }
        } else {
            // Fallback if state is somehow lost
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
            case 'loading':
                return <div className="flex justify-center items-center h-64"><Spinner /></div>;
            case 'landing':
                return <Landing onSectorSelect={handleSectorSelect} theme={theme} />;
            case 'quiz':
                 if (sector) {
                    return <Quiz sector={sector} onComplete={handleQuizComplete} />;
                 }
                 return <div className="text-center">Loading assessment...</div>;
            case 'hotResult':
                if (quizResult && sector) {
                     return <HotLeadResult result={quizResult} onReset={handleReset} sector={sector} onNavigateToGuide={handleNavigateToGuide} />;
                }
                 return <div className="flex justify-center items-center h-64"><Spinner /></div>;
            case 'warmResult':
                if (quizResult && sector) {
                     return <WarmLeadResult result={quizResult} onReset={handleReset} sector={sector} onNavigateToGuide={handleNavigateToGuide} />;
                }
                 return <div className="flex justify-center items-center h-64"><Spinner /></div>;
            case 'coldResult':
                if (quizResult && sector) {
                     return <ColdLeadResult result={quizResult} onReset={handleReset} sector={sector} onNavigateToGuide={handleNavigateToGuide} />;
                }
                 return <div className="flex justify-center items-center h-64"><Spinner /></div>;
            case 'buyersGuide':
                if (quizResult && sector) {
                    return <BuyersGuide result={quizResult} sector={sector} onReset={handleReset} onBackToResults={handleBackToResults} onGuideComplete={handleGuideComplete} guideEntrypoint={guideEntrypoint} />;
                }
                return <div className="flex justify-center items-center h-64"><Spinner /></div>;
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