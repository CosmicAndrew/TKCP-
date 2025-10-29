import React from 'react';
import { Sector, Result } from '../../../types';
import CalendarCTA from '../common/CalendarCTA';

interface SectionProps {
  sector: Sector;
  result: Result;
}

const Section3_Considerations: React.FC<SectionProps> = ({ sector }) => {
    const content = {
        church: {
            title: "Church-Specific Considerations",
            points: [
                "Enhancing Worship: How LED creates immersive, distraction-free environments for your congregation.",
                "Livestream Quality: Achieving a professional, flicker-free broadcast look for your online ministry.",
                "Volunteer-Friendly Tech: Simple control systems (like ProPresenter) that anyone can learn in minutes.",
                "Environmental Projection: Transforming your entire stage into a dynamic canvas for storytelling."
            ]
        },
        hospitality: {
            title: "Venue & Business Use Cases",
            points: [
                "Generating Revenue: Commanding premium prices for events with high-impact visuals and sponsorship opportunities.",
                "Competitive Advantage: Why modern venues are choosing integrated LED over temporary projection setups.",
                "Ultimate Flexibility: Reconfigure digital canvases for conferences, concerts, and galas on the fly.",
                "Architectural Integration: Seamlessly blending technology with your venue's aesthetic."
            ]
        }
    };
    
    const relevantContent = content[sector];

    return (
        <div className="animate-fade-in-up">
            <h2 className="text-3xl font-display font-bold text-gray-800">2. {relevantContent.title}</h2>
            <p className="mt-2 text-gray-600">Discover how an LED transformation directly impacts your organization's goals.</p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-bold font-display text-lg text-gray-800">Key Impact Areas</h3>
                    <ul className="mt-4 space-y-4 list-disc list-inside text-gray-700">
                        {relevantContent.points.map((point, index) => <li key={index}>{point}</li>)}
                    </ul>
                </div>
                <div className="space-y-4">
                    <div className="h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">AI-Generated Image Placeholder 1</div>
                    <div className="h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">AI-Generated Image Placeholder 2</div>
                </div>
            </div>

            <CalendarCTA
                headline="📅 Want Your Custom Church Assessment?"
                buttonText="Book Discovery Call"
            />
        </div>
    );
};

export default Section3_Considerations;