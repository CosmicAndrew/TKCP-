

import React, { useState, useEffect, useRef } from 'react';
import { Sector, UserData, Answer, LeadStatus } from '../types';
import { ASSESSMENT_QUESTIONS, calculateLeadTemperature } from '../constants';
import * as HubSpot from '../services/hubspot';
import ContactForm from './ContactForm';
import EmailCaptureForm from './EmailCaptureForm';
import QuestionCard from './QuestionCard';
import ProgressBar from './common/ProgressBar';

interface QuizProps {
    sector: Sector;
    onComplete: (answers: { [key: number]: Answer }, userData: Partial<UserData>) => void;
}

// Placeholder for Meta Pixel tracking
const trackMetaEvent = (eventName: string, params: object = {}) => {
    console.log(`[Meta Pixel Event]: ${eventName}`, params);
    // In a real app, you would integrate the Meta Pixel SDK here.
    // window.fbq('track', eventName, params);
};


const QUIZ_STATE_KEY = 'tkcp_quiz_state';

// FIX: Added an explicit return type to ensure that the state retrieved from localStorage is correctly typed.
// This prevents the 'answers' object from being inferred as 'any' or 'unknown', which was causing type errors downstream.
const getInitialState = (): { currentQuestionIndex: number; answers: { [key: number]: Answer } } => {
    try {
        const savedState = localStorage.getItem(QUIZ_STATE_KEY);
        if (savedState) {
            const parsed = JSON.parse(savedState);
            // Basic validation
            if (parsed && typeof parsed.currentQuestionIndex === 'number' && typeof parsed.answers === 'object' && parsed.answers !== null) {
                return { currentQuestionIndex: parsed.currentQuestionIndex, answers: parsed.answers };
            }
        }
    } catch (error) {
        console.error("Could not parse saved quiz state:", error);
    }
    return { currentQuestionIndex: 0, answers: {} };
}


const Quiz: React.FC<QuizProps> = ({ sector, onComplete }) => {
    const initialState = getInitialState();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(initialState.currentQuestionIndex);
    const [answers, setAnswers] = useState<{ [key: number]: Answer }>(initialState.answers);
    const [postQuizStep, setPostQuizStep] = useState<'contact' | 'emailCapture' | null>(null);
    const [leadStatusForForm, setLeadStatusForForm] = useState<LeadStatus | null>(null);

    const answerSound = useRef<HTMLAudioElement | null>(null);
    // A pleasant, subtle, and valid sound for answer selection.
    const answerAudioData = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';


    useEffect(() => {
        // Initialize the audio object once on component mount.
        if (typeof Audio !== 'undefined') {
            answerSound.current = new Audio(answerAudioData);
            answerSound.current.volume = 0.4; // Keep it subtle
        }
    }, []);

    useEffect(() => {
        trackMetaEvent('AssessmentStarted', { sector });
        HubSpot.trackEvent('Started Assessment', HubSpot.getSessionUserId(), { sector });
    }, [sector]);

    // Save progress to localStorage
    useEffect(() => {
        try {
            const stateToSave = JSON.stringify({ currentQuestionIndex, answers });
            localStorage.setItem(QUIZ_STATE_KEY, stateToSave);
        } catch (error) {
            console.error("Could not save quiz state:", error);
        }
    }, [currentQuestionIndex, answers]);
    
    const handleAnswer = (questionIndex: number, answer: Answer) => {
        // Play the sound effect
        if (answerSound.current) {
            answerSound.current.currentTime = 0; // Rewind to start for rapid clicks
            answerSound.current.play().catch(error => console.error("Audio playback failed:", error));
        }

        const newAnswers = { ...answers, [questionIndex]: answer };
        setAnswers(newAnswers);

        trackMetaEvent('AnswerQuestion', {
            question_index: questionIndex,
            question_category: ASSESSMENT_QUESTIONS[questionIndex].category,
            answer_value: answer.value,
            sector: sector
        });
    };
    
    const handleSubmit = () => {
        // This is the action for the final button
        const finalAnswer = answers[currentQuestionIndex];
        if (!finalAnswer) return; // Should not happen if button is enabled
        
        // Calculate score and lead status here to pass to the form component
        // FIX: Explicitly type the 'answer' parameter as 'Answer' to ensure its 'points' property is accessible as a number.
        const totalScore = Object.values(answers).reduce((sum, answer: Answer) => sum + answer.points, 0);
        const leadStatus = calculateLeadTemperature(totalScore);
        setLeadStatusForForm(leadStatus);

        const finalAnswerValue = finalAnswer.value;
        const compellingEvent = answers[3]?.value; // Get compelling event answer

        if (finalAnswerValue === 'committed' || finalAnswerValue === 'leaning' || compellingEvent === 'urgent_problem') {
            trackMetaEvent('ContactFormShown', { type: 'full_contact_form', lead_status: leadStatus });
            setPostQuizStep('contact');
        } else { // 'exploring' or 'general_interest'
            trackMetaEvent('ContactFormShown', { type: 'email_capture_form', lead_status: leadStatus });
            setPostQuizStep('emailCapture');
        }
    };
    
    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < ASSESSMENT_QUESTIONS.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handleFormSubmit = (data: Partial<UserData>) => {
        localStorage.removeItem(QUIZ_STATE_KEY); // Clear saved state on completion
        onComplete(answers, data);
    };

    const currentQuestion = ASSESSMENT_QUESTIONS[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === ASSESSMENT_QUESTIONS.length - 1;

    const renderFinalStep = () => {
        if (postQuizStep === 'contact' && leadStatusForForm) {
            return <ContactForm onSubmit={handleFormSubmit} sector={sector} leadStatus={leadStatusForForm} />;
        }
        if (postQuizStep === 'emailCapture') {
            return <EmailCaptureForm onSubmit={handleFormSubmit} sector={sector} />;
        }
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 md:p-8 rounded-lg shadow-xl transition-all duration-500 flex flex-col">
                {postQuizStep ? (
                    renderFinalStep()
                ) : (
                    <>
                        <ProgressBar 
                            progress={((currentQuestionIndex + 1) / ASSESSMENT_QUESTIONS.length) * 100}
                            sector={sector}
                            currentQuestionIndex={currentQuestionIndex}
                            totalQuestions={ASSESSMENT_QUESTIONS.length}
                            category={currentQuestion.category}
                        />
                        <div className="mt-6 flex-grow flex flex-col" role="region" aria-live="polite">
                           <QuestionCard
                                key={currentQuestionIndex}
                                question={currentQuestion}
                                questionIndex={currentQuestionIndex}
                                onAnswer={handleAnswer}
                                sector={sector}
                                selectedAnswer={answers[currentQuestionIndex]?.value}
                            />
                        </div>
                        <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700 navigation-buttons">
                            <div className="flex justify-between items-center">
                                <button
                                    onClick={handlePrevious}
                                    disabled={currentQuestionIndex === 0}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                                    aria-label="Previous Question"
                                >
                                    &larr; Previous
                                </button>
                                
                                <div className="text-sm font-bold text-gray-500 dark:text-gray-400">
                                    Question {currentQuestionIndex + 1} of {ASSESSMENT_QUESTIONS.length}
                                </div>

                                {isLastQuestion ? (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!answers[currentQuestionIndex]}
                                        className="px-6 py-2 bg-church-primary text-white font-semibold rounded-md hover:bg-church-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        aria-label="Finish Assessment"
                                    >
                                        Finish Assessment &rarr;
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleNext}
                                        disabled={!answers[currentQuestionIndex]}
                                        className="px-6 py-2 bg-church-primary text-white font-semibold rounded-md hover:bg-church-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        aria-label="Next Question"
                                    >
                                        Next &rarr;
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Quiz;