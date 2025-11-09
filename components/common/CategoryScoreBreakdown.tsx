import React, { useState, useEffect, useMemo } from 'react';
import { Result, Sector } from '../../types';
import { ASSESSMENT_QUESTIONS } from '../../constants';

interface CategoryScoreBreakdownProps {
    result: Result;
}

const CategoryScoreBreakdown: React.FC<CategoryScoreBreakdownProps> = ({ result }) => {
    const { answers, sector } = result;
    const [renderedPercentages, setRenderedPercentages] = useState<{ [key: string]: number }>({});

    const categoryScores = useMemo(() => {
        const scores = ASSESSMENT_QUESTIONS.reduce((acc, question, index) => {
            const category = question.category;
            if (!acc[category]) {
                acc[category] = { score: 0, maxScore: 0 };
            }
            acc[category].score += answers[index]?.points || 0;
            const maxPoints = Math.max(...question.options.map(o => o.points));
            acc[category].maxScore += maxPoints > 0 ? maxPoints : 0; // Only add if points are possible
            return acc;
        }, {} as { [key: string]: { score: number; maxScore: number } });
        
        // Filter out categories with no possible score to avoid displaying empty bars.
        return Object.entries(scores).filter(([, data]) => data.maxScore > 0);

    }, [answers]);

    useEffect(() => {
        // FIX: Replaced NodeJS.Timeout with ReturnType<typeof setTimeout> for browser compatibility.
        const timeouts: ReturnType<typeof setTimeout>[] = [];
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const finalPercentages = categoryScores.reduce((acc, [category, { score, maxScore }]) => {
                acc[category] = maxScore > 0 ? (score / maxScore) * 100 : 0;
                return acc;
            }, {} as { [key: string]: number });
            setRenderedPercentages(finalPercentages);
            return;
        }

        categoryScores.forEach(([category, { score, maxScore }], index) => {
            timeouts.push(setTimeout(() => {
                const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
                setRenderedPercentages(prev => ({ ...prev, [category]: percentage }));
            }, index * 200 + 300)); // Staggered animation with initial delay
        });

        return () => timeouts.forEach(clearTimeout);
    }, [categoryScores]);


    const barColor = sector === Sector.Church ? 'bg-church-accent' : 'bg-hospitality-accent';
    const textColor = sector === Sector.Church ? 'text-church-primary' : 'text-hospitality-primary';


    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-700/30 rounded-lg border dark:border-gray-200 dark:border-gray-700/50 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
            <h3 className={`text-xl font-display font-bold ${textColor} dark:text-inherit text-center mb-4`}>
                Your Score Breakdown
            </h3>
            <div className="space-y-4">
                {categoryScores.map(([category, { score, maxScore }]) => {
                    return (
                        <div key={category}>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{category}</span>
                                <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{score} / {maxScore}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 shadow-inner" aria-hidden="true">
                                <div
                                    className={`${barColor} h-4 rounded-full transition-all duration-1000 ease-out`}
                                    style={{ width: `${renderedPercentages[category] || 0}%` }}
                                ></div>
                            </div>
                             <div className="sr-only" role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={maxScore} aria-label={`${category} score is ${score} out of ${maxScore}`}></div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoryScoreBreakdown;