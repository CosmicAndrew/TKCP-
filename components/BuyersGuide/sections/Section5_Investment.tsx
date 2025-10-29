import React from 'react';
import { Sector } from '../../../types';
import CallToAction from '../common/CallToAction';

interface SectionProps {
  sector: Sector;
}

const Section5_Investment: React.FC<SectionProps> = ({ sector }) => {
    return (
        <div className="animate-fade-in-up">
            <h2 className="text-3xl font-display font-bold text-gray-800">5. Investment & Financing</h2>
            <p className="mt-2 text-gray-600">Understanding the financial side of your LED upgrade and the long-term value it brings.</p>
            
             <div className="mt-8 p-6 bg-gray-50 rounded-lg text-center">
                <h3 className="text-xl font-bold text-gray-700">Financial Planning Tools Coming Soon!</h3>
                <p className="mt-2 text-gray-600">
                    We're building interactive tools to help you plan:
                </p>
                <ul className="mt-4 text-left max-w-md mx-auto list-disc list-inside">
                    <li>Total Cost of Ownership (TCO) Calculator</li>
                    <li>Financing & Leasing Monthly Payment Estimator</li>
                    <li>Grant and Fundraising Resources ({sector === 'church' ? 'for Churches' : 'for Businesses'})</li>
                    <li>Trade-in Program Information</li>
                </ul>
            </div>

            <CallToAction
                headline="Need a Ballpark Quote?"
                subtext="Get a preliminary quote based on your assessment answers to help with your budget planning."
                buttonText="Generate My Estimate"
                onClick={() => console.log('CTA Clicked: Generate Estimate')}
            />
        </div>
    );
};

export default Section5_Investment;
