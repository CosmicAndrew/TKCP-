import React from 'react';
import { IconCalendar, IconArrowRight } from '../../common/Icon';

interface CallToActionProps {
    headline: string;
    subtext: string;
    buttonText: string;
    onClick: () => void;
}

const CallToAction: React.FC<CallToActionProps> = ({ headline, subtext, buttonText, onClick }) => {
    return (
        <div className="my-8 p-6 bg-gradient-to-r from-church-primary to-blue-800 text-white rounded-lg shadow-lg text-center">
            <h3 className="text-2xl font-display font-bold">{headline}</h3>
            <p className="mt-2 opacity-90">{subtext}</p>
            <button 
                onClick={onClick}
                className="mt-6 inline-flex items-center justify-center px-8 py-3 font-bold bg-church-accent text-church-primary rounded-md hover:bg-yellow-400 transition-all transform hover:scale-105"
            >
                <IconCalendar className="w-5 h-5 mr-2" />
                {buttonText}
                <IconArrowRight className="w-5 h-5 ml-2" />
            </button>
        </div>
    );
}

export default CallToAction;
