import React, { useState, useRef, useEffect } from 'react';
import { Sector, UserData, Answer } from '../types';
import { ASSESSMENT_QUESTIONS } from '../constants';
import ContactForm from './ContactForm';
import EmailCaptureForm from './EmailCaptureForm';
import QuestionCard from './QuestionCard';
import ProgressBar from './common/ProgressBar';
import Spinner from './common/Spinner';

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
    const [isTransitioning, setIsTransitioning] = useState(false);


    useEffect(() => {
        trackEvent('AssessmentStarted', { sector });
    }, [sector]);

    const progress = postQuizStep ? 100 : Math.round(((currentQuestionIndex) / ASSESSMENT_QUESTIONS.length) * 100);

    const handleAnswer = (questionIndex: number, answer: Answer) => {
        const newAnswers = { ...answers, [questionIndex]: answer };
        setAnswers(newAnswers);

         setTimeout(() => {
            if (currentQuestionIndex < ASSESSMENT_QUESTIONS.length - 1) {
                if (currentQuestionIndex === ASSESSMENT_QUESTIONS.length - 2) {
                    setIsTransitioning(true);
                    setTimeout(() => {
                        setCurrentQuestionIndex(prev => prev + 1);
                        setIsTransitioning(false);
                    }, 1200);
                } else {
                    setCurrentQuestionIndex(prev => prev + 1);
                }
            } else {
                 const finalAnswerValue = answer.value;
                 if (finalAnswerValue === 'committed' || finalAnswerValue === 'leaning') {
                     trackEvent('ContactFormShown', { type: 'full_contact_form' });
                     setPostQuizStep('contact');
                 } else { // 'exploring'
                     trackEvent('ContactFormShown', { type: 'email_capture_form' });
                     setPostQuizStep('emailCapture');
                 }
            }
        }, 300);
    };

    const handleFormSubmit = (data: Partial<UserData>) => {
        onComplete(answers, data);
    };

    const currentQuestion = ASSESSMENT_QUESTIONS[currentQuestionIndex];

    const renderFinalStep = () => {
        if (postQuizStep === 'contact') {
            return <ContactForm onSubmit={handleFormSubmit} />;
        }
        if (postQuizStep === 'emailCapture') {
            return <EmailCaptureForm onSubmit={handleFormSubmit} />;
        }
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <ProgressBar
                progress={progress}
                sector={sector}
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={ASSESSMENT_QUESTIONS.length}
            />
            <div className="mt-8 bg-white p-2 sm:p-6 md:p-8 rounded-lg shadow-xl transition-all duration-500 min-h-[500px] flex flex-col justify-center">
                {postQuizStep ? (
                    renderFinalStep()
                ) : isTransitioning ? (
                    <div className="text-center p-8 animate-fade-in">
                        <h2 className="text-2xl font-display font-bold text-gray-700">Now for your transformation potential...</h2>
                        <div className="mt-4">
                            <Spinner />
                        </div>
                    </div>
                ) : (
                    <QuestionCard
                        key={currentQuestionIndex}
                        question={currentQuestion}
                        questionIndex={currentQuestionIndex}
                        onAnswer={handleAnswer}
                        sector={sector}
                        selectedAnswer={answers[currentQuestionIndex]?.value}
                    />
                )}
            </div>
        </div>
    );
};

export default Quiz;