
import React from 'react';
import { Sector, Result } from '../../../types';
import CalendarCTA from '../common/CalendarCTA';

interface SectionProps {
  sector: Sector;
  result: Result;
}

const Section6_Investment: React.FC<SectionProps> = ({ sector }) => {
    return (
        <div className="animate-fade-in-up">
            <h2 className="text-3xl font-display font-bold text-gray-800 dark:text-gray-100">6. Investment & Financing</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Understanding the financial side of your LED upgrade and the long-term value it brings.</p>
            
             <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-700 text-center">
                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200">Financial Planning Tools</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                    We provide clear, comprehensive financial options to make your vision a reality.
                </p>
                <ul className="mt-4 text-left max-w-md mx-auto list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    <li>Total Cost of Ownership (TCO) Analysis vs. Projectors</li>
                    <li>Flexible Financing & Leasing Options</li>
                    <li>Grant and Fundraising Resources ({sector === 'church' ? 'for Houses of Worship' : 'for Businesses'})</li>
                    <li>Potential Trade-in Value for Your Old Equipment</li>
                </ul>
            </div>

            <CalendarCTA
                headline="💰 Discuss Your Investment Options"
                buttonText="Schedule Budget Planning Call"
                meetingType="planning"
            />
        </div>
    );
};

export default Section6_Investment;
