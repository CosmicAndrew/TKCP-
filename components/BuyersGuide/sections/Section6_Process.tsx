import React from 'react';
import { Sector, Result } from '../../../types';
import CalendarCTA from '../common/CalendarCTA';

interface SectionProps {
  sector: Sector;
  result: Result;
}

const Section6_Process: React.FC<SectionProps> = ({ sector }) => {
    const steps = [
        { name: "Discovery Call", description: "We listen to your vision, goals, and challenges." },
        { name: "Site Assessment", description: "Our engineers map out a technical plan for a perfect fit." },
        { name: "Proposal Review", description: "A transparent, detailed plan and quote with no surprises." },
        { name: "Installation", description: "Our professional team ensures a clean, efficient setup." },
        { name: "Training & Support", description: "We empower your team for long-term success." },
    ];

    return (
        <div className="animate-fade-in-up">
            <h2 className="text-3xl font-display font-bold text-gray-800">4. The TKCP Implementation Process</h2>
            <p className="mt-2 text-gray-600">Our partnership approach ensures a smooth, successful project from start to finish.</p>
            
             <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-bold font-display text-gray-700 mb-4">Your Journey to Visual Excellence</h3>
                <div className="space-y-4">
                    {steps.map((step, index) => (
                        <div key={index} className="flex items-start p-3 bg-white rounded-md border border-gray-200">
                           <span className="flex items-center justify-center w-8 h-8 rounded-full bg-church-primary text-white font-bold mr-4 flex-shrink-0">{index + 1}</span>
                           <div>
                                <p className="font-bold text-gray-800">{step.name}</p>
                                <p className="text-sm text-gray-600">{step.description}</p>
                           </div>
                        </div>
                    ))}
                </div>
            </div>

            <CalendarCTA
                headline="🚀 Ready to Move Forward?"
                buttonText="Book Implementation Planning Call"
            />
        </div>
    );
};

export default Section6_Process;