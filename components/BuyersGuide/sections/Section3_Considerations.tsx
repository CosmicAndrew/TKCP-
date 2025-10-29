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
            ],
        },
        hospitality: {
            title: "Venue & Business Use Cases",
            points: [
                "Generating Revenue: Commanding premium prices for events with high-impact visuals and sponsorship opportunities.",
                "Competitive Advantage: Why modern venues are choosing integrated LED over temporary projection setups.",
                "Ultimate Flexibility: Reconfigure digital canvases for conferences, concerts, and galas on the fly.",
                "Architectural Integration: Seamlessly blending technology with your venue's aesthetic."
            ],
        }
    };
    
    const relevantContent = content[sector];
    
    const caseStudies = {
        church: {
            quote: "We saw a 40% increase in online engagement after installing our TKCP LED wall. It created a dynamic, professional backdrop for our broadcast that projectors couldn't match.",
            source: "— Pastor John, Grace Fellowship Church"
        },
        hospitality: {
            quote: "The Grand Hall boosted premium event bookings by 60% in the first year. Our TKCP screen is now our biggest selling point and a significant revenue driver.",
            source: "— A. Davis, Venue Director, The Grand Hall"
        }
    };
    const relevantCaseStudy = caseStudies[sector];


    return (
        <div className="animate-fade-in-up">
            <h2 className="text-3xl font-display font-bold text-gray-800">3. {relevantContent.title}</h2>
            <p className="mt-2 text-gray-600">Discover how an LED transformation directly impacts your organization's goals.</p>

            <div className="mt-8 space-y-8">
                 <div className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-bold font-display text-lg text-gray-800">Key Impact Areas</h3>
                    <ul className="mt-4 space-y-4 list-disc list-inside text-gray-700">
                        {relevantContent.points.map((point, index) => <li key={index}>{point}</li>)}
                    </ul>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-bold font-display text-lg text-gray-800 text-center">Success Story</h3>
                <blockquote className="mt-4 p-4 bg-yellow-50 border-l-4 border-church-accent text-gray-700 italic">
                    <p>"{relevantCaseStudy.quote}"</p>
                    <cite className="block text-right mt-2 not-italic font-semibold text-gray-600">{relevantCaseStudy.source}</cite>
                     <div className="text-right mt-2 not-italic">
                        <a href="#" onClick={(e) => e.preventDefault()} className="text-sm font-bold text-church-primary hover:underline">
                            Read Full Story &rarr;
                        </a>
                    </div>
                </blockquote>
            </div>


            <CalendarCTA
                headline={`📅 Want Your Custom ${sector === 'church' ? 'Church' : 'Venue'} Assessment?`}
                buttonText="Book Discovery Call"
                meetingType="discovery"
            />
        </div>
    );
};

export default Section3_Considerations;