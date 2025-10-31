
import React, { useState, useEffect } from 'react';
import { Sector } from '../../types';

// Count-up hook for animating numbers
const useCountUp = (endValue: number, duration = 1500) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setCount(endValue);
            return;
        }

        const frameRate = 1000 / 60;
        const totalFrames = Math.round(duration / frameRate);
        let frame = 0;
        const counter = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            // Ease-out cubic function for a smooth slowdown
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(endValue * easedProgress));

            if (frame === totalFrames) {
                clearInterval(counter);
            }
        }, frameRate);

        return () => clearInterval(counter);
    }, [endValue, duration]);

    return count;
};

interface ScoreGaugeProps {
  score: number;
  maxScore: number;
  sector: Sector;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, maxScore, sector }) => {
  const animatedScore = useCountUp(score);
  const percentage = (score / maxScore) * 100;
  const strokeColor = sector === Sector.Church ? '#D4AF37' : '#FF6B35';
  const primaryTextColor = sector === Sector.Church ? 'text-church-primary dark:text-blue-300' : 'text-hospitality-primary dark:text-orange-300';

  return (
    <div className="relative w-48 h-48" role="status" aria-live="polite">
      <svg className="w-full h-full" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="gaugeGradientChurch" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2B4C7E" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>
          <linearGradient id="gaugeGradientHospitality" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1B365D" />
            <stop offset="100%" stopColor="#FF6B35" />
          </linearGradient>
        </defs>
        {/* Background track */}
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="currentColor"
          className="text-gray-200 dark:text-gray-700"
          strokeWidth="12"
        />
        {/* Score arc */}
        <path
          d="M 60 6 A 54 54 0 0 1 60 114 A 54 54 0 0 1 60 6"
          fill="none"
          stroke={`url(#gaugeGradient${sector === Sector.Church ? 'Church' : 'Hospitality'})`}
          strokeWidth="12"
          strokeDasharray={`${(percentage * 339.29) / 100} 339.29`}
          className="transition-all duration-1000 ease-out"
          style={{ transitionProperty: 'stroke-dasharray' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-5xl font-bold ${primaryTextColor}`}>{animatedScore}</span>
        <span className="text-lg font-semibold text-gray-500 dark:text-gray-400">/ {maxScore}</span>
        <span className="text-sm uppercase tracking-wider text-gray-400 dark:text-gray-500">Score</span>
      </div>
    </div>
  );
};

export default ScoreGauge;