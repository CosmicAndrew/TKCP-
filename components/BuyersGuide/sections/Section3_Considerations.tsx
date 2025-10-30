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
            quote: "We have three new beautiful LED screens and all with one purpose, to get the message out and I know that the church, the congregation, the people are going to be so blessed with the work that's being done.",
            source: "— Senior Pastor Arthur Reyes, Calvary Chapel Downey",
            imageUrl: "https://placehold.co/600x400/2B4C7E/FFFFFF/png?text=Worship+Experience",
            imageAlt: "A vibrant church service with an LED screen showing lyrics, enhancing the worship experience."
        },
        hospitality: {
            quote: "Since installing the LED wall, we've attracted higher-end corporate clients and increased our premium event bookings by 60% in the first year. The wall is our biggest selling point and has generated significant new revenue for us.",
            source: "— A. Davis, Venue Director, The Grand Hall",
            imageUrl: "https://placehold.co/600x400/1B365D/FFFFFF/png?text=Corporate+Event",
            imageAlt: "A corporate event in a grand hall, with a large LED screen displaying the company's logo."
        }
    };
    const relevantCaseStudy = caseStudies[sector];


    return (
        <div className="animate-fade-in-up">
            <h2 className="text-3xl font-display font-bold text-gray-800 dark:text-gray-100">4. {relevantContent.title}</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Discover how an LED transformation directly impacts your organization's goals.</p>

            <div className="mt-8 space-y-8">
                 <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-700">
                    <h3 className="font-bold font-display text-lg text-gray-800 dark:text-gray-100">Key Impact Areas</h3>
                    <ul className="mt-4 space-y-4 list-disc list-inside text-gray-700 dark:text-gray-300">
                        {relevantContent.points.map((point, index) => <li key={index}>{point}</li>)}
                    </ul>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-bold font-display text-lg text-gray-800 dark:text-gray-100 text-center">Success Story</h3>
                <div className="mt-4 flex flex-col md:flex-row items-center gap-6 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-l-4 border-church-accent">
                    <img src={relevantCaseStudy.imageUrl} alt={relevantCaseStudy.imageAlt} className="w-full md:w-1/3 rounded-lg shadow-md" />
                    <blockquote className="flex-1 text-gray-700 dark:text-gray-300 italic">
                        <p>"{relevantCaseStudy.quote}"</p>
                        <cite className="block text-right mt-2 not-italic font-semibold text-gray-600 dark:text-gray-400">{relevantCaseStudy.source}</cite>
                         <div className="text-right mt-4 not-italic">
                            <a href="https://thykingdomcomeproductions.com/testimonials/" target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-2 bg-church-primary text-white font-semibold rounded-md hover:bg-church-primary/90 transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg text-sm">
                                Read Full Story &rarr;
                            </a>
                        </div>
                    </blockquote>
                </div>
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