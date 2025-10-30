import React, { useState } from 'react';
import * as HubSpot from '../../services/hubspot';

const Feedback: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleFeedback = (rating: 'Positive' | 'Neutral' | 'Negative') => {
        HubSpot.trackEvent('Assessment Feedback Submitted', HubSpot.getSessionUserId(), { rating });
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-md animate-fade-in">
                <p className="font-semibold text-green-800 dark:text-green-300">Thank you for your feedback!</p>
            </div>
        );
    }

    return (
        <div className="mt-8 pt-6 border-t dark:border-gray-700 animate-fade-in-up">
            <h4 className="font-semibold text-center text-gray-700 dark:text-gray-200 mb-4">How was your experience?</h4>
            <div className="flex justify-center items-center gap-4 sm:gap-8">
                <button onClick={() => handleFeedback('Negative')} aria-label="Bad experience" className="text-4xl transform hover:scale-125 transition-transform focus:outline-none focus:ring-2 focus:ring-red-400 rounded-full p-1">😞</button>
                <button onClick={() => handleFeedback('Neutral')} aria-label="Neutral experience" className="text-4xl transform hover:scale-125 transition-transform focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-full p-1">😐</button>
                <button onClick={() => handleFeedback('Positive')} aria-label="Good experience" className="text-4xl transform hover:scale-125 transition-transform focus:outline-none focus:ring-2 focus:ring-green-400 rounded-full p-1">😊</button>
            </div>
        </div>
    );
};

export default Feedback;