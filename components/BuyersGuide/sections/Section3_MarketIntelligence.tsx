
import React from 'react';
import { Sector, Result } from '../../../types';
import CalendarCTA from '../common/CalendarCTA';

interface SectionProps {
  sector: Sector;
  result: Result;
}

const InsightCard: React.FC<{ icon: string; title: string; text: string }> = ({ icon, title, text }) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 insight-card">
        <div className="flex items-center">
            <span className="text-2xl mr-3">{icon}</span>
            <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100">{title}</h4>
        </div>
        <p className="mt-2 text-gray-600 dark:text-gray-300">{text}</p>
    </div>
);

const Section3_MarketIntelligence: React.FC<SectionProps> = ({ sector }) => {
    return (
        <div className="animate-fade-in-up">
            <h2 className="text-3xl font-display font-bold text-gray-800 dark:text-gray-100">3. LED Market Intelligence Dashboard</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">See how TKCP compares to other LED providers and market trends in your area.</p>

            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700 market-intelligence">
                <h3 className="text-xl font-display font-bold text-center text-church-primary dark:text-blue-300 mb-6">🎯 Why Organizations Choose TKCP</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 comparison-grid">
                    <InsightCard 
                        icon="🏆"
                        title="Local Market Leader"
                        text="TKCP has installed 40% more LED systems in DFW than the nearest competitor."
                    />
                     <InsightCard 
                        icon="⚡"
                        title="Faster Installation"
                        text="Our certified in-house teams average a 2-3 day install vs. the industry standard of 5-7 days."
                    />
                     <InsightCard 
                        icon="🛡️"
                        title="Superior Warranty"
                        text="We offer a 5-year comprehensive parts and labor warranty, beating the typical 2-3 year limited coverage."
                    />
                </div>
            </div>

            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-display font-bold text-center text-gray-800 dark:text-gray-100">Key Ministry Insights</h3>
                 <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">Based on data from over 200+ church partnerships in Texas.</p>
                 <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="text-center bg-white dark:bg-gray-800 p-4 rounded-lg">
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Avg. Annual Savings (vs Projectors)</p>
                        <p className="text-3xl font-bold text-green-600">$8,250</p>
                    </div>
                     <div className="text-center bg-white dark:bg-gray-800 p-4 rounded-lg">
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Avg. Online Viewership Increase</p>
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">+40%</p>
                    </div>
                </div>
            </div>

            <CalendarCTA
                headline="💡 Get a Personalized Competitive Analysis"
                buttonText="Book a Discovery Call"
                meetingType="discovery"
            />
        </div>
    );
};

export default Section3_MarketIntelligence;
