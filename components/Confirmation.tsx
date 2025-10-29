import React from 'react';
import { LeadStatus, UserData } from '../types';
import { IconCalendar, IconMail, IconPhone, IconRefresh } from './common/Icon';

interface ConfirmationProps {
    result: {
        userData: Partial<UserData>;
        leadStatus: LeadStatus;
        score: number;
    };
    onReset: () => void;
}

const ConfettiPiece: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
    <div className="absolute w-2 h-4" style={style}></div>
);

const Confetti: React.FC = () => {
    const pieces = Array.from({ length: 50 }).map((_, i) => {
        const style: React.CSSProperties = {
            left: `${Math.random() * 100}%`,
            animation: `confetti-fall ${1 + Math.random()}s ease-out ${Math.random() * 2}s forwards`,
            backgroundColor: ['#2B4C7E', '#D4AF37', '#1B365D', '#FF6B35'][Math.floor(Math.random() * 4)],
        };
        return <ConfettiPiece key={i} style={style} />;
    });
    return <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">{pieces}</div>;
};

const Confirmation: React.FC<ConfirmationProps> = ({ result, onReset }) => {
    const { userData } = result;

    return (
        <div className="max-w-3xl mx-auto text-center animate-fade-in relative">
            <Confetti />
            <div className="bg-white rounded-lg shadow-2xl p-8 md:p-12 relative z-10">
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-800">You're All Set!</h2>
                {userData.email && (
                    <p className="mt-4 text-lg text-gray-600">
                        Thank you, {userData.firstName || 'friend'}. Your booking link and personalized insights are being sent to <strong>{userData.email}</strong>.
                    </p>
                )}
                <p className="mt-2 text-lg text-gray-600">
                    Jasmine or another team member will be calling you within 24 business hours to discuss your project.
                </p>

                <div className="mt-10 border-t pt-8">
                    <h3 className="text-2xl font-display font-bold">Can't Wait?</h3>
                    <p className="text-gray-600 mt-2">Feel free to reach out to us directly.</p>
                    <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                        <a href="#" className="flex items-center justify-center w-full sm:w-auto px-8 py-3 font-bold text-white rounded-md bg-church-primary hover:opacity-90 transition-opacity">
                            <IconCalendar className="w-5 h-5" />
                            <span className="ml-2">Book a Time Now</span>
                        </a>
                        <a href="tel:+14698409808" className="flex items-center justify-center w-full sm:w-auto px-8 py-3 font-bold text-white rounded-md bg-church-accent hover:opacity-90 transition-opacity">
                            <IconPhone className="w-5 h-5" />
                            <span className="ml-2">Call Us Directly</span>
                        </a>
                    </div>
                </div>

                <div className="mt-12">
                     <button onClick={onReset} className="text-gray-500 hover:text-gray-800 font-semibold flex items-center mx-auto transition-colors">
                        <IconRefresh className="mr-2"/>
                        Start Over
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Confirmation;
