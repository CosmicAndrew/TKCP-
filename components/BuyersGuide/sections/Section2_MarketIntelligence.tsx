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


const Section2_MarketIntelligence: React.FC<SectionProps> = ({ sector }) => {
    const marketInsights = {
      church: [
        "Average LED adoption rate in Texas churches has grown 25% year-over-year.",
        "The most common projector complaints are bulb failures during service and poor visibility in daylight.",
        "Churches typically see a full ROI within 3-4 years from maintenance savings and increased engagement."
      ],
      hospitality: [
        "Venues with integrated LED walls command a 15-30% higher booking fee for corporate events.",
        "Event planners in DFW now list 'high-quality AV' as a top 3 requirement when selecting a venue.",
        "Eliminating AV rental costs can increase an event's profit margin by an average of 20%."
      ]
    };
    
    return (
        <div className="animate-fade-in-up">
            <h2 className="text-3xl font-display font-bold text-gray-800 dark:text-gray-100">2. LED Market Intelligence Dashboard</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">See how TKCP compares to other LED providers and market trends in your area.</p>

            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700 market-intelligence">
                <h3 className="text-xl font-display font-bold text-center text-church-primary dark:text-blue-300 mb-6">🎯 Why Organizations Choose TKCP</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 comparison-grid">
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

            <div className="mt-8">
                 <h3 className="text-xl font-display font-bold text-gray-700 dark:text-gray-200">Key {sector === 'church' ? 'Ministry' : 'Business'} Insights</h3>
                 <ul className="mt-4 space-y-2 list-disc list-inside text-gray-700 dark:text-gray-300">
                    {marketInsights[sector].map((insight, index) => <li key={index}>{insight}</li>)}
                 </ul>
            </div>

            <CalendarCTA
                headline="💡 Get a Personalized Competitive Analysis"
                buttonText="Book a Discovery Call"
                meetingType="discovery"
            />
        </div>
    );
};

export default Section2_MarketIntelligence;