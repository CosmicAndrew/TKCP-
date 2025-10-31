import React, { useState, useEffect, useRef } from 'react';

interface InfoCardProps {
    icon: React.ReactNode;
    title: string;
    value: string;
    description: string;
    color: 'blue' | 'yellow';
}


const useCountUp = (endValue: number, duration = 1500, isDecimal = false, start: boolean) => {
    const [count, setCount] = useState(0);
    const frameRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        if (!start) {
            setCount(0);
            return;
        }

        let animationFrameId: number;
        let startTime: number | undefined = undefined;

        const animate = (timestamp: number) => {
            if (startTime === undefined) {
                startTime = timestamp;
            }
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            // Ease-out cubic easing function
            const easedPercentage = 1 - Math.pow(1 - percentage, 3);
            
            const newCount = easedPercentage * endValue;
            setCount(newCount);

            if (progress < duration) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                setCount(endValue);
            }
        };
        
        animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [endValue, duration, start]);

    return isDecimal ? parseFloat(count.toFixed(1)) : Math.round(count);
};


const InfoCard: React.FC<InfoCardProps> = ({ icon, title, value, description, color }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.5 }
        );
        if (cardRef.current) {
            observer.observe(cardRef.current);
        }
        return () => observer.disconnect();
    }, []);
    
    // Robustly parse the value for a number and its surrounding text to handle thousand separators.
    const match = value.match(/([^\d.]*)([\d.,]+)(.*)/s);
    
    const prefix = match ? match[1] : value;
    const numberString = match ? match[2] : '0';
    const suffix = match ? match[3] : '';

    const numericValue = parseFloat(numberString.replace(/,/g, ''));
    const isDecimal = numberString.includes('.');
    
    const animatedCount = useCountUp(isNaN(numericValue) ? 0 : numericValue, 1500, isDecimal, isVisible);

    const displayContent = match 
        ? <>{prefix}{animatedCount.toLocaleString()}{suffix}</>
        : <>{value}</>;

    const colorClasses = {
        blue: {
            bg: 'bg-blue-50 dark:bg-blue-900/30',
            border: 'border-blue-200 dark:border-blue-800',
            icon: 'text-church-primary dark:text-blue-400',
            value: 'text-church-primary dark:text-blue-300',
        },
        yellow: {
            bg: 'bg-yellow-50 dark:bg-yellow-900/30',
            border: 'border-yellow-300 dark:border-yellow-700',
            icon: 'text-church-accent dark:text-yellow-400',
            value: 'text-church-accent dark:text-yellow-300',
        }
    };
    const selectedColor = colorClasses[color];

    return (
        <div ref={cardRef} className={`p-4 rounded-lg border ${selectedColor.bg} ${selectedColor.border}`}>
            <div className="flex items-center gap-4">
                <div className={`flex-shrink-0 text-3xl ${selectedColor.icon}`}>
                    {icon}
                </div>
                <div>
                    <p className="font-semibold text-gray-600 dark:text-gray-300">{title}</p>
                    <p className={`text-3xl font-bold ${selectedColor.value}`}>
                       {displayContent}
                    </p>
                </div>
            </div>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
    );
};

export default InfoCard;