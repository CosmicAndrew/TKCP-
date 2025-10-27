
import React, { useState, useEffect, useRef } from 'react';
import { Sector, UserData, Answer } from '../types';
import { ASSESSMENT_QUESTIONS } from '../constants';
import ContactForm from './ContactForm';
import QuestionCard from './QuestionCard';
import ProgressBar from './common/ProgressBar';

interface QuizProps {
    sector: Sector;
    onComplete: (answers: { [key: number]: Answer }, userData: UserData, completionTime: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ sector, onComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<{ [key: number]: Answer }>({});
    const [userData, setUserData] = useState<UserData>({ firstName: '', lastName: '', email: '', phone: '' });
    const [isContactStep, setIsContactStep] = useState(true);
    const startTimeRef = useRef<number>(Date.now());

    const totalSteps = ASSESSMENT_QUESTIONS.length + 1; // 1 for contact form
    const progress = Math.round(((currentQuestionIndex + (isContactStep ? 0 : 1)) / totalSteps) * 100);

    const handleAnswer = (questionIndex: number, answer: Answer) => {
        setAnswers(prev => ({ ...prev, [questionIndex]: answer }));
         setTimeout(() => {
            if (currentQuestionIndex < ASSESSMENT_QUESTIONS.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                 const completionTime = Math.round((Date.now() - startTimeRef.current) / 1000);
                onComplete( { ...answers, [questionIndex]: answer }, userData, completionTime);
            }
        }, 300);
    };

    const handleContactSubmit = (data: UserData) => {
        setUserData(data);
        setIsContactStep(false);
    };

    const currentQuestion = ASSESSMENT_QUESTIONS[currentQuestionIndex];

    return (
        <div className="max-w-3xl mx-auto">
            <ProgressBar progress={progress} sector={sector} />
            <div className="mt-8 bg-white p-8 rounded-lg shadow-xl transition-all duration-500">
                {isContactStep ? (
                    <ContactForm onSubmit={handleContactSubmit} />
                ) : (
                    <QuestionCard
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
