import React, { useState, useRef } from 'react';
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
    const [isContactStep, setIsContactStep] = useState(false);
    const startTimeRef = useRef<number>(Date.now());

    const progress = isContactStep ? 100 : Math.round((currentQuestionIndex / ASSESSMENT_QUESTIONS.length) * 100);

    const handleAnswer = (questionIndex: number, answer: Answer) => {
        const newAnswers = { ...answers, [questionIndex]: answer };
        setAnswers(newAnswers);

         setTimeout(() => {
            if (currentQuestionIndex < ASSESSMENT_QUESTIONS.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                 setIsContactStep(true);
            }
        }, 300);
    };

    const handleContactSubmit = (data: UserData) => {
        const completionTime = Math.round((Date.now() - startTimeRef.current) / 1000);
        onComplete(answers, data, completionTime);
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
