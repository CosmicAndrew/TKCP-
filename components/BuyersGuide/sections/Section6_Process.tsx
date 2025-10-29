import React from 'react';
import { Sector } from '../../../types';
import CallToAction from '../common/CallToAction';

interface SectionProps {
  sector: Sector;
}

const Section6_Process: React.FC<SectionProps> = ({ sector }) => {
    const steps = [
        "1. Discovery Call: We listen to your vision and goals.",
        "2. Site Assessment: Our engineers map out the technical plan.",
        "3. Proposal Review: A transparent, detailed plan and quote.",
        "4. Installation: Professional, clean, and efficient setup.",
        "5. Training & Support: We empower your team for success.",
    ];

    return (
        <div className="animate-fade-in-up">
            <h2 className="text-3xl font-display font-bold text-gray-800">6. The TKCP Implementation Process</h2>
            <p className="mt-2 text-gray-600">Our partnership approach ensures a smooth, successful project from start to finish.</p>
            
             <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-bold font-display text-gray-700 mb-4">Your Journey to Visual Excellence</h3>
                <div className="space-y-4">
                    {steps.map((step, index) => (
                        <div key={index} className="flex items-center p-3 bg-white rounded-md border border-gray-200">
                           <span className="flex items-center justify-center w-8 h-8 rounded-full bg-church-primary text-white font-bold mr-4">{index + 1}</span>
                           <span className="text-gray-700">{step}</span>
                        </div>
                    ))}
                </div>
            </div>

            <CallToAction
                headline="Ready to Start Your Journey?"
                subtext="The first step is a simple, no-obligation conversation about your vision."
                buttonText="Book Your Discovery Call"
                onClick={() => console.log('CTA Clicked: Book Discovery Call')}
            />
        </div>
    );
};

export default Section6_Process;
