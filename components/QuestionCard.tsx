
import React from 'react';
import { Question, Answer, Sector } from '../types';

interface QuestionCardProps {
    question: Question;
    questionIndex: number;
    onAnswer: (questionIndex: number, answer: Answer) => void;
    sector: Sector;
    selectedAnswer?: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, questionIndex, onAnswer, sector, selectedAnswer }) => {
    return (
        <div className="animate-fade-in">
            <p className="text-sm font-bold uppercase tracking-wider text-gray-500">{question.category}</p>
            <h2 className="mt-2 text-2xl md:text-3xl font-display font-bold text-gray-800">{question.text}</h2>
            <div className="mt-8 space-y-4">
                {question.options.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => onAnswer(questionIndex, { value: option.value, points: option.points })}
                        className={`w-full text-left p-4 border-2 rounded-lg text-lg transition-all duration-200 flex items-center
                            ${selectedAnswer === option.value
                                ? (sector === Sector.Church ? 'bg-church-accent/20 border-church-accent' : 'bg-hospitality-accent/20 border-hospitality-accent')
                                : 'border-gray-200 hover:border-gray-400'
                            }`}
                    >
                        <span className={`flex-shrink-0 w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center
                          ${selectedAnswer === option.value 
                            ? (sector === Sector.Church ? 'border-church-accent' : 'border-hospitality-accent')
                            : 'border-gray-400'
                          }`}>
                          {selectedAnswer === option.value && <span className={`w-3 h-3 rounded-full 
                            ${sector === Sector.Church ? 'bg-church-accent' : 'bg-hospitality-accent'}`}></span>}
                        </span>
                        <span>{option.text[sector]}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuestionCard;
