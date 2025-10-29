import React from 'react';

interface CalendarCTAProps {
    headline: string;
    buttonText: string;
}

const CalendarCTA: React.FC<CalendarCTAProps> = ({ headline, buttonText }) => {
    const handleScheduleClick = () => {
        console.log(`Scheduling link clicked: ${buttonText}`);
        // In a real app, this would open a HubSpot Meetings or Calendly link.
        window.open('https://thykingdomcomeproductions.com/contact', '_blank');
    };

    return (
        <div className="my-8 p-6 bg-gray-100 border border-gray-200 rounded-lg text-center">
            <h4 className="text-xl font-display font-bold text-gray-800">{headline}</h4>
            <button
                onClick={handleScheduleClick}
                className="mt-4 px-8 py-3 bg-church-accent text-church-primary font-bold rounded-md hover:bg-yellow-400 transition-transform hover:scale-105"
            >
                {buttonText}
            </button>
        </div>
    );
};

export default CalendarCTA;
