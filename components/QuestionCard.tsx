import React, { useState, useEffect } from 'react';
import { Question, Answer, Sector, PathDetail } from '../types';

interface QuestionCardProps {
    question: Question;
    questionIndex: number;
    onAnswer: (questionIndex: number, answer: Answer) => void;
    sector: Sector;
    selectedAnswer?: string;
}

const TwoPathsSimple: React.FC<{ path: PathDetail; sector: Sector }> = ({ path, sector }) => {
    const problem = {
        title: path.title[sector],
        points: path.points[sector],
        footer: path.footer[sector]
    };
    const solution = {
        title: { church: "LED Transformation", hospitality: "The LED Advantage" }[sector],
        points: {
            church: ["Never change bulbs again", "Technology that just works", "Perfect visibility everywhere", "Ministry focus, not tech stress"],
            hospitality: ["Zero annual rental costs", "Command premium event pricing", "Unlimited creative flexibility", "Rock-solid reliability"]
        }[sector],
        footer: { church: "Best decision we ever made", hospitality: "Our best investment in years" }[sector]
    };

    return (
      <div className="two-paths-comparison flex flex-col md:flex-row gap-4 md:gap-6 my-8">
        {/* Problem Card */}
        <div className="path-card flex-1 p-5 md:p-6 border-2 border-[#dc3545] rounded-xl bg-[#fff5f5] shadow-md transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl">
          <h3 className="text-center text-xl font-display font-bold text-[#b02a37] mb-4">{problem.title}</h3>
          <ul className="space-y-2 list-disc list-inside text-gray-700" style={{ lineHeight: 1.5 }}>
            {problem.points.map((point, i) => <li key={i}>{point}</li>)}
          </ul>
          <p className="mt-6 text-center italic text-gray-600">"{problem.footer}"</p>
        </div>
  
        {/* Solution Card */}
        <div className="path-card flex-1 p-5 md:p-6 border-2 border-church-primary rounded-xl bg-[#f0f4ff] shadow-md transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl">
          <h3 className="text-center text-xl font-display font-bold text-church-primary mb-4">{solution.title}</h3>
          <ul className="space-y-2 list-disc list-inside text-gray-800" style={{ lineHeight: 1.5 }}>
            {solution.points.map((point, i) => <li key={i}>{point}</li>)}
          </ul>
          <p className="mt-6 text-center italic text-church-accent font-semibold">"{solution.footer}"</p>
        </div>
      </div>
    );
  };


const QuestionCard: React.FC<QuestionCardProps> = ({ question, questionIndex, onAnswer, sector, selectedAnswer }) => {
    const header = (
        <div>
            <p className="text-sm font-bold uppercase tracking-wider text-gray-500 text-center">{question.category}</p>
            <h2 className="mt-2 text-xl sm:text-2xl md:text-3xl font-display font-bold text-gray-800 text-center">{question.text(sector)}</h2>
        </div>
    );

    if (question.visual === 'two-paths') {
        return (
             <div className="animate-slide-in-right flex-grow flex flex-col">
                {header}
                
                {question.paths && <TwoPathsSimple path={question.paths} sector={sector} />}
               
                <div className="mt-auto">
                    <h4 className="text-xl font-display font-bold text-gray-700 mb-4 text-center">How committed are you to this transformation?</h4>
                    <div className="space-y-3 max-w-lg mx-auto">
                        {question.options.map((option, index) => (
                             <button
                                key={option.value}
                                onClick={() => onAnswer(questionIndex, { value: option.value, points: option.points })}
                                className={`assessment-question-option w-full text-left p-4 border rounded-lg text-lg transition-all duration-200 flex items-center transform hover:-translate-y-1
                                ${selectedAnswer === option.value
                                    ? (sector === Sector.Church ? 'border-church-primary ring-2 ring-church-primary/50 bg-church-primary/5 scale-[1.01] shadow-lg' : 'border-hospitality-primary ring-2 ring-hospitality-primary/50 bg-hospitality-primary/5 scale-[1.01] shadow-lg')
                                    : 'border-gray-300 hover:border-gray-400 bg-white'
                                }`}
                            >
                                <span className={`flex-shrink-0 w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center
                                  ${selectedAnswer === option.value 
                                    ? (sector === Sector.Church ? 'border-church-primary' : 'border-hospitality-primary')
                                    : 'border-gray-400'
                                  }`}>
                                  {selectedAnswer === option.value && <span className={`w-3 h-3 rounded-full 
                                    ${sector === Sector.Church ? 'bg-church-primary' : 'bg-hospitality-primary'}`}></span>}
                                </span>
                                <span>{option.text[sector]}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Default question card renderer
    return (
        <div className="animate-slide-in-right flex-grow flex flex-col">
            <div className="text-left">
                <p className="text-sm font-bold uppercase tracking-wider text-gray-500">{question.category}</p>
                <h2 className="mt-2 text-xl sm:text-2xl md:text-3xl font-display font-bold text-gray-800">{question.text(sector)}</h2>
            </div>

            <div className="mt-8 space-y-4 flex-grow">
                {question.options.map((option, index) => (
                    <button
                        key={option.value}
                        onClick={() => onAnswer(questionIndex, { value: option.value, points: option.points })}
                        className={`assessment-question-option w-full text-left p-4 border-2 rounded-lg text-lg transition-all duration-200 flex items-center transform hover:-translate-y-1
                            ${selectedAnswer === option.value
                                ? (sector === Sector.Church ? 'bg-church-accent/20 border-church-accent scale-[1.01] shadow-lg' : 'bg-hospitality-accent/20 border-hospitality-accent scale-[1.01] shadow-lg')
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