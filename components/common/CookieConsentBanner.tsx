import React, { useState, useEffect } from 'react';

const COOKIE_CONSENT_KEY = 'tkcp_cookie_consent';

const CookieConsentBanner: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        try {
            const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
            if (consent !== 'true') {
                setIsVisible(true);
            }
        } catch (error) {
            console.error("Could not access localStorage for cookie consent:", error);
            // If localStorage is unavailable, we might want to just not show the banner
            // or assume consent cannot be stored. For this case, we'll just not show it.
            setIsVisible(false);
        }
    }, []);

    const handleAccept = () => {
        try {
            localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
            setIsVisible(false);
        } catch (error) {
            console.error("Could not save cookie consent to localStorage:", error);
            // Hide the banner even if saving fails to not block the UI.
            setIsVisible(false);
        }
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 dark:bg-black text-white p-4 z-50 animate-fade-in-up" role="dialog" aria-live="polite" aria-label="Cookie Consent Banner">
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-center sm:text-left text-gray-200 dark:text-gray-300">
                    We use cookies to enhance your experience, save your assessment progress, and for analytics purposes. By clicking 'Accept', you agree to our use of cookies.
                </p>
                <button
                    onClick={handleAccept}
                    className="flex-shrink-0 px-6 py-2 bg-church-accent text-church-primary font-bold rounded-md hover:bg-yellow-400 transition-colors"
                    aria-label="Accept cookies"
                >
                    Accept
                </button>
            </div>
        </div>
    );
};

export default CookieConsentBanner;