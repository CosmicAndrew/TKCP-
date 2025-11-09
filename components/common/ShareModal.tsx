import React, { useState, useEffect } from 'react';
import { Result } from '../../types';
import { IconTwitter, IconFacebook, IconLinkedIn, IconLink } from './Icon';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    result: Result;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, result }) => {
    const [shareUrl, setShareUrl] = useState('');
    const [copyStatus, setCopyStatus] = useState('Copy');

    useEffect(() => {
        if (isOpen) {
            const resultDataString = JSON.stringify(result);
            const encodedResult = btoa(resultDataString);
            const url = `${window.location.origin}${window.location.pathname}#results=${encodedResult}`;
            setShareUrl(url);
            setCopyStatus('Copy'); // Reset status when modal opens
        }
    }, [isOpen, result]);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopyStatus('Copied!');
            setTimeout(() => setCopyStatus('Copy'), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            setCopyStatus('Failed!');
            setTimeout(() => setCopyStatus('Copy'), 2000);
        }
    };

    const shareText = `I just took the TKCP LED Assessment and scored ${result.score}/${result.maxScore}! Check out my results and take the assessment yourself to see if an LED wall is right for your organization.`;
    const shareTitle = 'My TKCP LED Assessment Results';

    const socialLinks = {
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}&summary=${encodeURIComponent(shareText)}`,
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-modal-title"
        >
            <div 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-md animate-fade-in-up"
                onClick={e => e.stopPropagation()}
            >
                <h2 id="share-modal-title" className="text-2xl font-display font-bold text-center text-gray-800 dark:text-gray-100">Share Your Results</h2>
                <p className="text-center text-gray-600 dark:text-gray-300 mt-2 mb-6">Let others know about your experience!</p>
                
                <div className="flex justify-center gap-4 mb-6">
                    <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-500 transition-colors" aria-label="Share on Twitter">
                        <IconTwitter />
                    </a>
                    <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-700 transition-colors" aria-label="Share on Facebook">
                        <IconFacebook />
                    </a>
                    <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-600 transition-colors" aria-label="Share on LinkedIn">
                        <IconLinkedIn />
                    </a>
                </div>

                <div className="relative">
                    <label htmlFor="share-url" className="sr-only">Shareable Link</label>
                    <input
                        id="share-url"
                        type="text"
                        value={shareUrl}
                        readOnly
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md p-2 pr-28 text-sm text-gray-600 dark:text-gray-400"
                        aria-label="Shareable link"
                    />
                    <button
                        onClick={handleCopyLink}
                        className={`absolute right-1 top-1 bottom-1 px-4 text-sm font-semibold rounded-md transition-colors ${
                            copyStatus === 'Copied!' 
                            ? 'bg-green-500 text-white' 
                            : 'bg-church-primary text-white hover:bg-church-primary/90'
                        }`}
                    >
                        {copyStatus === 'Copied!' ? 'Copied!' : <IconLink className="inline-block mr-1 h-4 w-4"/>}
                        {copyStatus !== 'Copied!' && 'Copy'}
                    </button>
                </div>
                
                <button
                    onClick={onClose}
                    className="mt-6 w-full text-center text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 font-semibold transition-colors text-sm"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default ShareModal;