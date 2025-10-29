import React from 'react';
import { Sector } from '../../../types';
import CallToAction from '../common/CallToAction';

interface SectionProps {
  sector: Sector;
}

const Section3_Considerations: React.FC<SectionProps> = ({ sector }) => {
    const content = {
        church: {
            title: "Church-Specific Considerations",
            points: [
                "Enhancing Worship: How LED creates immersive, distraction-free environments.",
                "Livestream Quality: Achieving a professional broadcast look for your online ministry.",
                "Volunteer-Friendly Tech: Simple control systems anyone can learn in minutes.",
                "Case Studies: See how Texas churches are leveraging LED for growth."
            ]
        },
        hospitality: {
            title: "Venue & Business Use Cases",
            points: [
                "Generating Revenue: Commanding premium prices for events with high-impact visuals.",
                "Competitive Advantage: Why modern venues are choosing LED over projection.",
                "Ultimate Flexibility: Reconfigure digital canvases for conferences, concerts, and galas.",
                "Case Studies: Explore successful transformations in hotels and event centers."
            ]
        }
    };
    
    const relevantContent = content[sector];

    return (
        <div className="animate-fade-in-up">
            <h2 className="text-3xl font-display font-bold text-gray-800">3. {relevantContent.title}</h2>
            <p className="mt-2 text-gray-600">Discover how an LED transformation directly impacts your organization's goals.</p>
            
             <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <ul className="space-y-4 list-disc list-inside text-gray-700">
                    {relevantContent.points.map((point, index) => <li key={index}>{point}</li>)}
                </ul>
            </div>
            
            <p className="mt-6 text-center font-semibold text-gray-800">More content, including detailed case studies and videos, coming soon!</p>

             <CallToAction
                headline="Want to See a Local Success Story?"
                subtext="We can connect you with a client near you for a first-hand look."
                buttonText="Arrange a Reference Visit"
                onClick={() => console.log('CTA Clicked: Reference Visit')}
            />
        </div>
    );
};

export default Section3_Considerations;
