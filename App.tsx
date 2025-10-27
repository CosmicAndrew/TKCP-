
import React, { useState, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Sector, LeadStatus, UserData, Answer } from './types';
import { ASSESSMENT_QUESTIONS } from './constants';
import Header from './components/Header';
import Landing from './components/Landing';
import Quiz from './components/Quiz';
import Results from './components/Results';
import Footer from './components/Footer';

const App: React.FC = () => {
    const [step, setStep] = useState<number>(0);
    const [sector, setSector] = useState<Sector | null>(null);
    const [userData, setUserData] = useState<UserData>({ firstName: '', lastName: '', email: '', phone: '' });
    const [answers, setAnswers] = useState<{ [key: number]: Answer }>({});
    const [score, setScore] = useState<number>(0);
    const [leadStatus, setLeadStatus] = useState<LeadStatus>('cold');
    const [personalizedInsights, setPersonalizedInsights] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [completionTime, setCompletionTime] = useState<number>(0);

    const handleStart = (selectedSector: Sector) => {
        setSector(selectedSector);
        setStep(1);
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
            You are an expert consultant for TKCP, a company specializing in high-end LED video walls for churches and hospitality venues.
            A potential client from the '${finalSector}' sector has just completed an assessment.
            Their final score is ${finalScore} out of 13.
            Their answers are: ${JSON.stringify(formattedAnswers, null, 2)}

            Based on this information, provide three distinct, personalized, specific, and actionable insights that offer immediate value.
            The tone should be professional, consultative, and encouraging. Address the client directly.
            For example, if they have a short timeline and approved budget, commend their readiness. If they are struggling with maintenance, highlight how LED solves that specific pain point.
            Focus on creating value and building trust.
            `;
            
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            insights: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.STRING,
                                    description: "A single personalized insight."
                                },
                                description: "An array of three personalized insights for the user."
                            }
                        }
                    },
                }
            });

            const jsonResponse = JSON.parse(response.text);
            if (jsonResponse.insights && Array.isArray(jsonResponse.insights) && jsonResponse.insights.length > 0) {
                 setPersonalizedInsights(jsonResponse.insights);
            } else {
                 throw new Error("Invalid response format from API.");
            }

        } catch (e) {
            console.error("Error generating insights:", e);
            setError("We couldn't generate personalized insights at this time. Please see your results below.");
            // Fallback insights
            setPersonalizedInsights([
                "Upgrading to an LED wall can significantly reduce your annual maintenance costs compared to projector systems.",
                "Modern LED displays offer unmatched brightness and clarity, ensuring your message is seen clearly from every seat.",
                "Investing in high-quality AV enhances the experience for your audience and can lead to greater engagement and revenue."
            ]);
        } finally {
            setIsLoading(false);
        }
    }, []);


    const handleQuizComplete = (finalAnswers: { [key: number]: Answer }, finalUserData: UserData, time: number) => {
        setAnswers(finalAnswers);
        setUserData(finalUserData);
        setCompletionTime(time);

        const totalScore = Object.values(finalAnswers).reduce((sum, answer) => sum + answer.points, 0);
        const roundedScore = Math.round(totalScore);
        setScore(roundedScore);

        let status: LeadStatus = 'cold';
        if (roundedScore >= 8) status = 'hot';
        else if (roundedScore >= 4) status = 'warm';
        setLeadStatus(status);

        if (sector) {
            generatePersonalizedInsights(roundedScore, finalAnswers, sector);
        }
        
        setStep(ASSESSMENT_QUESTIONS.length + 2); // Final results step
    };

    const handleReset = () => {
        setStep(0);
        setSector(null);
        setUserData({ firstName: '', lastName: '', email: '', phone: '' });
        setAnswers({});
        setScore(0);
        setLeadStatus('cold');
        setPersonalizedInsights([]);
        setIsLoading(false);
        setError(null);
        setCompletionTime(0);
    };

    const renderContent = () => {
        if (step === 0 || !sector) {
            return <Landing onStart={handleStart} />;
        }
        if (step > 0 && step <= ASSESSMENT_QUESTIONS.length + 1) {
            return <Quiz sector={sector} onComplete={handleQuizComplete} />;
        }
        if (step > ASSESSMENT_QUESTIONS.length + 1) {
            return (
                <Results
                    sector={sector}
                    score={score}
                    leadStatus={leadStatus}
                    insights={personalizedInsights}
                    isLoading={isLoading}
                    error={error}
                    onReset={handleReset}
                    completionTime={completionTime}
                    userData={userData}
                />
            );
        }
        return null;
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
