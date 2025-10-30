import React from 'react';
import { Sector } from '../../types';

interface ProgressBarProps {
    progress: number;
    sector: Sector;
    currentQuestionIndex: number;
    totalQuestions: number;
    category: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, sector, currentQuestionIndex, totalQuestions, category }) => {
    const barColor = sector === Sector.Church ? 'bg-church-primary' : 'bg-hospitality-accent';
    const textColor = sector === Sector.Church ? 'text-church-primary' : 'text-hospitality-accent';

    return (
        <div
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Assessment progress: Step ${currentQuestionIndex + 1} of ${totalQuestions}, Category: ${category}`}
        >
            <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                    <p className={`text-sm font-bold uppercase tracking-wider ${textColor}`}>
                        {category}
                    </p>
                    <div className="text-right flex-shrink-0">
                         <span className={`text-xs font-semibold inline-block ${sector === Sector.Church ? 'text-church-primary dark:text-blue-300' : 'text-hospitality-primary dark:text-orange-300'}`}>
                            Question {currentQuestionIndex + 1} of {totalQuestions}
                         </span>
                    </div>
                </div>
                <div className="overflow-hidden h-3 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
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