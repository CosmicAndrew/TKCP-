
import React, { useState, useEffect, useRef } from 'react';
import { Sector, UserData, Answer, LeadStatus } from '../types';
import { ASSESSMENT_QUESTIONS, calculateLeadTemperature } from '../constants';
import * as HubSpot from '../services/hubspot';
import ContactForm from './ContactForm';
import EmailCaptureForm from './EmailCaptureForm';
import QuestionCard from './QuestionCard';
import ProgressBar from './common/ProgressBar';
// FIX: Adding volume icons to be used by the new mute button.
import { IconVolumeUp, IconVolumeOff } from './common/Icon';

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
    const [isMuted, setIsMuted] = useState(false);

    const answerSound = useRef<HTMLAudioElement | null>(null);
    
    // --- Sector-Specific Audio ---
    const hospitalityAudioData = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='; // Professional click
    // FIX: Replaced corrupted and extremely long base64 string with a valid, short one to fix syntax error.
    const churchAudioData = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='; // Gentle chime (using a valid placeholder)

    // Save state to localStorage
    useEffect(() => {
        const stateToSave = {
            currentQuestionIndex,
            answers
        };
        localStorage.setItem(QUIZ_STATE_KEY, JSON.stringify(stateToSave));
    }, [currentQuestionIndex, answers]);
    
    // Initialize audio on component mount
    useEffect(() => {
        try {
            answerSound.current = new Audio(sector === 'church' ? churchAudioData : hospitalityAudioData);
            answerSound.current.volume = 0.15; // Set default volume
        } catch (e) {
            console.error("Could not initialize audio:", e);
        }
    }, [sector, churchAudioData, hospitalityAudioData]);


    const playSound = () => {
        if (answerSound.current && !isMuted) {
            answerSound.current.currentTime = 0; // Rewind to start
            answerSound.current.play().catch(e => console.error("Audio play failed:", e));
        }
    };
    
    const triggerHapticFeedback = () => {
        if ('vibrate' in navigator) {
            const pattern = sector === 'church' ? [50] : [30, 40, 30]; // Single pulse for church, double for hospitality
            navigator.vibrate(pattern);
        }
    };

    const handleAnswer = (questionIndex: number, answer: Answer) => {
        playSound();
        triggerHapticFeedback();
        setAnswers(prev => ({ ...prev, [questionIndex]: answer }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < ASSESSMENT_QUESTIONS.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            // Quiz is finished, decide which form to show
            // FIX: Explicitly cast Object.values(answers) to Answer[] to resolve TypeScript inference issue where `answer` was treated as `unknown`.
            const totalScore = (Object.values(answers) as Answer[]).reduce((sum, answer) => sum + answer.points, 0);
            const leadStatus = calculateLeadTemperature(totalScore);
            setLeadStatusForForm(leadStatus);

            if (leadStatus === 'hot') {
                trackMetaEvent('ViewContent', { content_name: 'Hot Lead Contact Form' });
                setPostQuizStep('contact');
            } else {
                trackMetaEvent('ViewContent', { content_name: 'Warm/Cold Lead Email Capture' });
                setPostQuizStep('emailCapture');
            }
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handleContactFormSubmit = (data: UserData) => {
        onComplete(answers, data);
    };

    const handleEmailCaptureSubmit = (data: Partial<UserData>) => {
        const [firstName, ...lastName] = (data.fullName || '').split(' ');
        const userData = {
            ...data,
            firstName,
            lastName: lastName.join(' ')
        };
        onComplete(answers, userData);
    };
    
    const progress = ((currentQuestionIndex + 1) / ASSESSMENT_QUESTIONS.length) * 100;
    const currentQuestion = ASSESSMENT_QUESTIONS[currentQuestionIndex];

    const encouragementMessages = [
        "You're on your way!",
        "Keep going, great insights ahead...",
        "Discovering God's perfect plan for your display solution...",
        "Almost there, your vision is getting clearer!",
        "Final step to unlocking your potential!"
    ];
    const progressIndex = Math.floor((currentQuestionIndex / ASSESSMENT_QUESTIONS.length) * encouragementMessages.length);
    const encouragement = encouragementMessages[progressIndex];


    if (postQuizStep) {
        return (
            <div className="max-w-2xl mx-auto">
                {postQuizStep === 'contact' && leadStatusForForm && (
                    <ContactForm onSubmit={handleContactFormSubmit} sector={sector} leadStatus={leadStatusForForm} />
                )}
                {postQuizStep === 'emailCapture' && (
                    <EmailCaptureForm onSubmit={handleEmailCaptureSubmit} sector={sector} />
                )}
            </div>
        );
    }

    if (!currentQuestion) {
        return (
            <div className="max-w-4xl mx-auto p-8 text-center bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                <h3 className="text-2xl font-display font-bold text-red-600 dark:text-red-400">An Error Occurred</h3>
                <p className="mt-4 text-gray-700 dark:text-gray-300">
                    We've encountered an issue with the assessment. Your progress has been saved.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 px-6 py-2 bg-church-primary text-white font-semibold rounded-md hover:bg-church-primary/90 transition-colors"
                >
                    Refresh Page
                </button>
            </div>
        );
    }
    
    return (
        <div className="max-w-4xl mx-auto">
            <div className="sticky top-0 bg-neutral-light/80 dark:bg-gray-900/80 backdrop-blur-sm z-10 py-4 mb-4">
                <div className="flex items-center gap-4">
                    <div className="flex-grow">
                         <ProgressBar 
                            progress={progress} 
                            sector={sector} 
                            currentQuestionIndex={currentQuestionIndex}
                            totalQuestions={ASSESSMENT_QUESTIONS.length}
                            category={currentQuestion.category}
                        />
                         <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">{encouragement}</p>
                    </div>
                     <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                        aria-label={isMuted ? "Unmute audio feedback" : "Mute audio feedback"}
                     >
                        {isMuted ? <IconVolumeOff className="w-5 h-5" /> : <IconVolumeUp className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-xl min-h-[60vh] flex flex-col">
                <QuestionCard
                    question={currentQuestion}
                    questionIndex={currentQuestionIndex}
                    onAnswer={handleAnswer}
                    sector={sector}
                    selectedAnswer={answers[currentQuestionIndex]?.value}
                />

                <div className="navigation-buttons mt-8 pt-6 border-t dark:border-gray-700 flex justify-between items-center print-hide">
                    <button
                        onClick={handlePrev}
                        disabled={currentQuestionIndex === 0}
                        className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={!answers[currentQuestionIndex]}
                        className="px-6 py-3 bg-church-primary text-white font-semibold rounded-md hover:bg-church-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label={currentQuestionIndex === ASSESSMENT_QUESTIONS.length - 1 ? 'Finish assessment' : 'Next question'}
                    >
                        {currentQuestionIndex === ASSESSMENT_QUESTIONS.length - 1 ? 'Finish' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Quiz;