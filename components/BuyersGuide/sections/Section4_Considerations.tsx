

import React from 'react';
import { Sector, Result } from '../../../types';
import CalendarCTA from '../common/CalendarCTA';

interface SectionProps {
  sector: Sector;
  result: Result;
}

const Section4_Considerations: React.FC<SectionProps> = ({ sector }) => {
    const content = {
        church: {
            title: "Church-Specific Considerations",
            points: [
                "Worship Services - Song lyrics, sermon notes, scripture",
                "Announcements - Service times, events, giving campaigns",
                "Live-streaming - Broadcast-quality online ministry",
                "Youth Ministry - Gaming, movies, interactive content",
                "Special Services - Christmas, Easter, baptisms, weddings",
                "Multi-site Campuses - Synchronized content distribution",
                "Fellowship Halls - Photo slideshows, community updates",
                "Entryway Signage - Digital announcements and wayfinding",
            ],
        },
        hospitality: {
            title: "Venue & Business Use Cases",
            points: [
                "Corporate Events - Presentations, keynotes, company branding",
                "Concerts & Shows - Stage backdrops, artist visuals, lighting",
                "Weddings - Custom monograms, photo slideshows, ceremonies",
                "Trade Shows - Booth displays, product demonstrations",
                "Hotel Lobbies - Brand messaging, local attraction displays",
                "Conference Centers - Multi-room event coordination",
                "Wayfinding - Digital signage, event schedules, navigation",
            ],
            revenueImpact: "Generate 30-40% more venue revenue by attracting premium bookings and eliminating $30-60K in annual third-party AV rental costs."
        }
    };
    
    const relevantContent = content[sector];
    
    const caseStudies = {
        church: {
            quote: "Installed 3 LED video walls in our 3,500-seat main sanctuary. Experience was fantastic—we would recommend them to anyone.",
            source: "— Brenden Burge, Lilly Grove Baptist Church, Houston, TX",
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
                {sector === 'hospitality' && content.hospitality.revenueImpact && (
                     <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <h3 className="font-bold font-display text-lg text-green-800 dark:text-green-200">Revenue Impact</h3>
                        <p className="mt-2 text-green-700 dark:text-green-300">{content.hospitality.revenueImpact}</p>
                    </div>
                )}
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
                                Read More &rarr;
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

export default Section4_Considerations;
