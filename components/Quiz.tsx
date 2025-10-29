import React, { useState, useEffect } from 'react';
import { Sector, UserData, Answer } from '../types';
import { ASSESSMENT_QUESTIONS } from '../constants';
import ContactForm from './ContactForm';
import EmailCaptureForm from './EmailCaptureForm';
import QuestionCard from './QuestionCard';

interface QuizProps {
    sector: Sector;
    onComplete: (answers: { [key: number]: Answer }, userData: Partial<UserData>) => void;
}

// Placeholder for Meta Pixel tracking
const trackEvent = (eventName: string, params: object = {}) => {
    console.log(`Meta Pixel Event: ${eventName}`, params);
};

const Quiz: React.FC<QuizProps> = ({ sector, onComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<{ [key: number]: Answer }>({});
    const [postQuizStep, setPostQuizStep] = useState<'contact' | 'emailCapture' | null>(null);

    useEffect(() => {
        trackEvent('AssessmentStarted', { sector });
    }, [sector]);
    
    const handleAnswer = (questionIndex: number, answer: Answer) => {
        const newAnswers = { ...answers, [questionIndex]: answer };
        setAnswers(newAnswers);
    };
    
    const handleNext = () => {
        if (currentQuestionIndex < ASSESSMENT_QUESTIONS.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            // This is the "Finish Assessment" action
            const finalAnswer = answers[currentQuestionIndex];
            if (!finalAnswer) return; // Should not happen if button is enabled
            
            const finalAnswerValue = finalAnswer.value;
            if (finalAnswerValue === 'committed' || finalAnswerValue === 'leaning') {
                trackEvent('ContactFormShown', { type: 'full_contact_form' });
                setPostQuizStep('contact');
            } else { // 'exploring'
                trackEvent('ContactFormShown', { type: 'email_capture_form' });
                setPostQuizStep('emailCapture');
            }
        }
    };
    
    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleFormSubmit = (data: Partial<UserData>) => {
        onComplete(answers, data);
    };

    const currentQuestion = ASSESSMENT_QUESTIONS[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === ASSESSMENT_QUESTIONS.length - 1;

    const renderFinalStep = () => {
        if (postQuizStep === 'contact') {
            return <ContactForm onSubmit={handleFormSubmit} sector={sector} />;
        }
        if (postQuizStep === 'emailCapture') {
            return <EmailCaptureForm onSubmit={handleFormSubmit} />;
        }
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-xl transition-all duration-500 min-h-[550px] flex flex-col">
                {postQuizStep ? (
                    renderFinalStep()
                ) : (
                    <>
                        <QuestionCard
                            key={currentQuestionIndex}
                            question={currentQuestion}
                            questionIndex={currentQuestionIndex}
                            onAnswer={handleAnswer}
                            sector={sector}
                            selectedAnswer={answers[currentQuestionIndex]?.value}
                        />
                        <div className="mt-auto pt-6 border-t border-gray-200">
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
                                <button
                                    onClick={handleNext}
                                    disabled={!answers[currentQuestionIndex]}
                                    className="px-6 py-2 bg-church-primary text-white font-semibold rounded-md hover:bg-church-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    aria-label={isLastQuestion ? "Finish Assessment" : "Next Question"}
                                >
                                    {isLastQuestion ? 'Finish Assessment' : 'Next'} &rarr;
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Quiz;
