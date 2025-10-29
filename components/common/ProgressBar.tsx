import React from 'react';
import { Sector } from '../../types';

interface ProgressBarProps {
    progress: number;
    sector: Sector;
    currentQuestionIndex: number;
    totalQuestions: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, sector, currentQuestionIndex, totalQuestions }) => {
    const isFinalQuestion = currentQuestionIndex === totalQuestions - 1;
    const barColor = isFinalQuestion
        ? 'bg-church-accent'
        : (sector === Sector.Church ? 'bg-church-primary' : 'bg-hospitality-primary');

    return (
        <div>
            <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                    <div className="flex items-center">
                        {Array.from({ length: totalQuestions }).map((_, i) => (
                            <span
                                key={i}
                                className={`text-xl transition-colors duration-500 ${i < currentQuestionIndex ? 'text-yellow-400' : 'text-gray-300'}`}
                                style={{ filter: i < currentQuestionIndex ? 'drop-shadow(0 0 3px gold)' : 'none' }}
                            >
                                ⭐
                            </span>
                        ))}
                    </div>
                    <div className="text-right">
                       {isFinalQuestion ? (
                            <span className="text-xs font-bold bg-church-accent text-white px-2 py-1 rounded-full animate-bounce-in">
                                IMPACT QUESTION
                            </span>
                       ) : (
                         <span className={`text-xs font-semibold inline-block ${sector === Sector.Church ? 'text-church-primary' : 'text-hospitality-primary'}`}>
                            {progress}%
                         </span>
                       )}
                    </div>
                </div>
                <div className="overflow-hidden h-3 text-xs flex rounded bg-gray-200">
                    <div
                        style={{ width: `${progress}%` }}
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${barColor} transition-all duration-500 ease-out`}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;