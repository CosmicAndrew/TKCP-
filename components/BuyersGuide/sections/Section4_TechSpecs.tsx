import React from 'react';
import { Sector } from '../../../types';
import CallToAction from '../common/CallToAction';

interface SectionProps {
  sector: Sector;
}

const Section4_TechSpecs: React.FC<SectionProps> = ({ sector }) => {
    return (
        <div className="animate-fade-in-up">
            <h2 className="text-3xl font-display font-bold text-gray-800">4. Technical Specifications</h2>
            <p className="mt-2 text-gray-600">A breakdown of the key technical terms you need to know, explained in simple language.</p>
            
            <div className="mt-8 p-6 bg-gray-50 rounded-lg text-center">
                <h3 className="text-xl font-bold text-gray-700">Interactive Tech Explorer Coming Soon!</h3>
                <p className="mt-2 text-gray-600">
                    Soon, you'll be able to visually explore:
                </p>
                <ul className="mt-4 text-left max-w-md mx-auto list-disc list-inside">
                    <li>Pixel Pitch Guide: See the difference resolution makes.</li>
                    <li>Brightness Levels (Nits): Indoor vs. outdoor needs.</li>
                    <li>Connectivity Options: From HDMI to network streaming.</li>
                    <li>Control Systems: Powerful and easy-to-use interfaces.</li>
                </ul>
            </div>

            <CallToAction
                headline="Have a Technical Question?"
                subtext="Our engineers are happy to talk specifics. No sales pressure, just answers."
                buttonText="Ask an Engineer"
                onClick={() => console.log('CTA Clicked: Ask Engineer')}
            />
        </div>
    );
};

export default Section4_TechSpecs;
