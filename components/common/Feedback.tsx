import React, { useState } from 'react';
import * as HubSpot from '../../services/hubspot';

const EMOJIS = [
    { rating: 1, emoji: '😞', label: 'Very Dissatisfied' },
    { rating: 2, emoji: '😐', label: 'Dissatisfied' },
    { rating: 3, emoji: '😊', label: 'Neutral' },
    { rating: 4, emoji: '😄', label: 'Satisfied' },
    { rating: 5, emoji: '🤩', label: 'Very Satisfied' },
];
const CHAR_LIMIT = 150;


const Feedback: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);
    const [rating, setRating] = useState<number | null>(null);
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    const [comment, setComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === null) {
            alert("Please select a rating before submitting.");
            return;
        }

        HubSpot.trackEvent('Assessment Feedback Submitted', HubSpot.getSessionUserId(), { 
            rating: rating,
            comment: comment || undefined
        });

        console.log(`Feedback submitted: Rating=${rating}, Comment='${comment}'`);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg animate-fade-in">
                <p className="font-semibold text-green-800 dark:text-green-300">Thank you for your valuable feedback!</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50/50 dark:bg-gray-700/20 border border-gray-200/80 dark:border-gray-700/50 rounded-lg animate-fade-in-up">
            <form onSubmit={handleSubmit}>
                <h4 className="font-semibold text-center text-gray-700 dark:text-gray-200 mb-4">How was your experience with this assessment?</h4>
                <div 
                    className="flex justify-center items-center gap-4 sm:gap-6 mb-4"
                    onMouseLeave={() => setHoverRating(null)}
                >
                    {EMOJIS.map(({ rating: r, emoji, label }) => (
                        <button
                            key={r}
                            type="button"
                            onClick={() => setRating(r)}
                            onMouseEnter={() => setHoverRating(r)}
                            aria-label={label}
                            className={`text-4xl transform transition-transform duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-church-primary rounded-full p-1
                                ${ (hoverRating ?? rating ?? 0) >= r ? 'scale-125' : 'scale-100 opacity-60 hover:opacity-100'}`}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>

                <div className="relative">
                    <label htmlFor="feedback-comment" className="sr-only">What could we improve?</label>
                    <textarea
                        id="feedback-comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        maxLength={CHAR_LIMIT}
                        placeholder="What could we improve? (Optional)"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-church-primary focus:border-transparent transition"
                        rows={2}
                    />
                    <span className="absolute bottom-2 right-2 text-xs text-gray-400 dark:text-gray-500">
                        {comment.length}/{CHAR_LIMIT}
                    </span>
                </div>
                
                <button
                    type="submit"
                    disabled={!rating}
                    className="mt-4 w-full sm:w-auto mx-auto flex justify-center px-6 py-2 bg-church-primary text-white font-semibold rounded-md hover:bg-church-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Submit Feedback
                </button>
            </form>
        </div>
    );
};

export default Feedback;