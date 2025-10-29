import React, { useState, useEffect } from 'react';
import { Sector, UserData, Answer } from '../types';
import { ASSESSMENT_QUESTIONS } from '../constants';
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
const trackEvent = (eventName: string, params: object = {}) => {
    console.log(`Meta Pixel Event: ${eventName}`, params);
};

const QUIZ_STATE_KEY = 'tkcp_quiz_state';

const getInitialState = () => {
    try {
        const savedState = localStorage.getItem(QUIZ_STATE_KEY);
        if (savedState) {
            const { currentQuestionIndex, answers } = JSON.parse(savedState);
            // Basic validation
            if (typeof currentQuestionIndex === 'number' && typeof answers === 'object' && answers !== null) {
                return { currentQuestionIndex, answers };
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

    useEffect(() => {
        trackEvent('AssessmentStarted', { sector });
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
        const newAnswers = { ...answers, [questionIndex]: answer };
        setAnswers(newAnswers);
    };
    
    const handleSubmit = () => {
        // This is the action for the final button
        const finalAnswer = answers[currentQuestionIndex];
        if (!finalAnswer) return; // Should not happen if button is enabled
        
        const finalAnswerValue = finalAnswer.value;
        const compellingEvent = answers[3]?.value; // Get compelling event answer

        if (finalAnswerValue === 'committed' || finalAnswerValue === 'leaning' || compellingEvent === 'urgent_problem') {
            trackEvent('ContactFormShown', { type: 'full_contact_form' });
            setPostQuizStep('contact');
        } else { // 'exploring' or 'general_interest'
            trackEvent('ContactFormShown', { type: 'email_capture_form' });
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
        if (postQuizStep === 'contact') {
            return <ContactForm onSubmit={handleFormSubmit} sector={sector} />;
        }
        if (postQuizStep === 'emailCapture') {
            return <EmailCaptureForm onSubmit={handleFormSubmit} sector={sector} />;
        }
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-xl transition-all duration-500 flex flex-col">
                {postQuizStep ? (
                    renderFinalStep()
                ) : (
                    <>
                        <ProgressBar 
                            progress={((currentQuestionIndex) / ASSESSMENT_QUESTIONS.length) * 100}
                            sector={sector}
                            currentQuestionIndex={currentQuestionIndex}
                            totalQuestions={ASSESSMENT_QUESTIONS.length}
                        />
                        <div className="mt-6 flex-grow flex flex-col">
                           <QuestionCard
                                key={currentQuestionIndex}
                                question={currentQuestion}
                                questionIndex={currentQuestionIndex}
                                onAnswer={handleAnswer}
                                sector={sector}
                                selectedAnswer={answers[currentQuestionIndex]?.value}
                            />
                        </div>
                        <div className="mt-auto pt-6 border-t border-gray-200 navigation-buttons">
                            <div className="flex justify-between items-center">
                                <button
                                    onClick={handlePrevious}
                                    disabled={currentQuestionIndex === 0}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    aria-label="Previous Question"
                                >
                                    &larr; Previous
                                </button>
                                
                                <div className="text-sm font-bold text-gray-500">
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