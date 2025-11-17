
import React from 'react';
import { Sector, Result } from '../../../types';
import CalendarCTA from '../common/CalendarCTA';

interface SectionProps {
  sector: Sector;
  result: Result;
}

const Section5_Process: React.FC<SectionProps> = ({ sector }) => {
    const steps = [
        { name: "Discovery Call", description: "We listen to your vision, goals, and challenges." },
        { name: "Site Assessment", description: "Our engineers map out a technical plan for a perfect fit." },
        { name: "Proposal Review", description: "A transparent, detailed plan and quote with no surprises." },
        { name: "Installation", description: "Our professional team ensures a clean, efficient setup." },
        { name: "Training & Support", description: "We empower your team for long-term success." },
    ];

    return (
        <div className="animate-fade-in-up">
            <h2 className="text-3xl font-display font-bold text-gray-800 dark:text-gray-100">5. The TKCP Implementation Process</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Our partnership approach ensures a smooth, successful project from start to finish.</p>
            
             <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-700">
                <h3 className="text-xl font-bold font-display text-gray-700 dark:text-gray-200 mb-6 text-center">Your Journey to Visual Excellence</h3>
                <div className="relative">
                    {/* The vertical connector line */}
                    <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200 dark:bg-gray-600" aria-hidden="true"></div>
                    
                    <div className="space-y-8">
                        {steps.map((step, index) => (
                            <div key={index} className="relative flex items-start space-x-4">
                                {/* The circle and number */}
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-church-primary text-white font-bold flex items-center justify-center z-10">
                                    {index + 1}
                                </div>
                                {/* The content */}
                                <div className="min-w-0 flex-1">
                                    <p className="font-bold text-gray-800 dark:text-gray-100">{step.name}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <CalendarCTA
                headline="🚀 Ready to Move Forward?"
                buttonText="Book Implementation Planning Call"
                meetingType="planning"
            />
        </div>
    );
};

export default Section5_Process;
