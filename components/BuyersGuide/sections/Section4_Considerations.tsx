

import React from 'react';
import { Sector, Result } from '../../../types';
import { HUBSPOT_CONFIG, LINK_CLASS, TKCP_CONFIG } from '../../../constants';

interface SectionProps {
  sector: Sector;
  result: Result;
}

const content = {
    church: {
        title: "Church-Specific LED Video Wall Applications",
        subtitle: "Transform your worship space into an environment where every seat has the perfect view and every message lands with clarity.",
        applications: [
            { emoji: '🎵', title: 'Worship Services', description: "Display song lyrics, sermon notes, and scripture with crystal clarity. Churches report a 40% increase in online viewership quality and engagement." },
            { emoji: '📢', title: 'Announcements & Communications', description: "Make service times, events, and giving campaigns visible from every seat. Eliminate the 'I didn't see the announcement' excuse." },
            { emoji: '📹', title: 'Live-Streaming Ministry', description: "Achieve broadcast-quality visuals for your online congregation. LED displays provide the professional look that keeps remote attendees engaged." },
            { emoji: '🎮', title: 'Youth & Family Ministry', description: "Host gaming nights, movie events, and interactive lessons. Transform your youth space into the coolest place teens want to be." },
            { emoji: '✨', title: 'Special Services', description: "Christmas, Easter, baptisms, weddings—create unforgettable moments with stunning visuals that match the significance of these celebrations." },
            { emoji: '🌐', title: 'Multi-Site Campuses', description: "Synchronize content across multiple locations for a unified message and experience." },
            { emoji: '🤝', title: 'Fellowship & Community', description: "Share photo slideshows, community updates, and ministry highlights to strengthen connections beyond Sunday morning." },
            { emoji: '💡', title: 'Entryway & Lobby Signage', description: "Use digital wayfinding, welcome messages, and event schedules to create a modern first impression." }
        ],
        financialImpact: {
            title: '💰 Annual Savings & Stewardship',
            points: [
                "Eliminate $8,000-$10,000 in lamp replacements and maintenance.",
                "100,000+ hour lifespan equals 8-10 years of faithful service.",
                "A one-time investment replaces recurring projector costs, freeing up budget for ministry."
            ]
        },
        testimonial: {
            quote: "Installed 3 LED video walls in our 3,500-seat sanctuary. Experience was fantastic—we recommend them to anyone.",
            author: "Brenden Burge, Worship Pastor",
            org: "Lilly Grove Baptist Church, Houston, TX",
            imageUrl: "https://images.unsplash.com/photo-1507692049440-535914c61a57?q=80&w=800&auto=format&fit=crop",
            imageAlt: "A vibrant church service with an LED screen showing lyrics, enhancing the worship experience.",
            link: {
                text: "Read More Testimonials →",
                href: "https://thykingdomcomeproductions.com/testimonials"
            }
        },
        cta: {
            headline: "📋 Want Your Custom Church Assessment?",
            description: "Based on your sanctuary size, viewing distances, and ministry goals, we'llrecommend the perfect LED video wall solution—tailored specifically for your church.",
            primaryButton: { text: "Book Discovery Call", link: HUBSPOT_CONFIG.meetingLinks.discovery },
            secondaryButton: { text: "See Church Case Studies →", link: "https://thykingdomcomeproductions.com/portfolio" },
            trustSignal: "Trusted by 200+ churches nationwide"
        }
    },
    hospitality: {
        title: "Hospitality & Event LED Video Wall Applications",
        subtitle: "Transform your venue into a premium destination that commands higher rates and attracts the events others can't.",
        applications: [
            { emoji: '💼', title: 'Corporate Events & Conferences', description: "Professional-grade presentations, keynotes, branding. Attract Fortune 500 clients willing to pay premium rates for premium visuals." },
            { emoji: '🎤', title: 'Concerts & Live Performances', description: "Book the shows that demand cutting-edge production." },
            { emoji: '💍', title: 'Weddings & Special Events', description: "Become the 'must-have' venue for high-end celebrations." },
            { emoji: '🏢', title: 'Trade Shows & Exhibitions', description: "Host the events that drive business results." },
            { emoji: '🏨', title: 'Hotel Lobbies & Brand Experiences', description: "Create the modern luxury experience guests expect." },
            { emoji: '📍', title: 'Wayfinding & Digital Signage', description: "Enhance guest experience while creating sponsorship opportunities." },
            { emoji: '🏟️', title: 'Multi-Purpose Event Spaces', description: "Adapt your space for any event type. Sports viewing, galas, meetings—one space, infinite possibilities." }
        ],
        financialImpact: {
            title: '📈 Venue Revenue & ROI',
            points: [
                "Generate 30-40% more revenue by attracting premium corporate bookings.",
                "Eliminate $30,000-$60,000 in annual third-party AV rental costs.",
                "Create new revenue streams (screen advertising, sponsor placements).",
                "Win bids against competitors who rent equipment.",
                "Command higher venue rates with owned LED technology.",
                "Achieve a 12-18 month typical ROI payback period."
            ]
        },
        testimonial: {
            quote: "The LED video wall transformed our conference center from 'nice' to 'world-class.' We've seen a 35% increase in corporate bookings and our event coordinators love the flexibility.",
            author: "Events Director",
            org: "Kings Mill Resort",
            imageUrl: "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=800&auto=format&fit=crop",
            imageAlt: "A corporate event in a grand hall, with a large LED screen displaying the company's logo.",
            link: {
                text: "Read Hospitality Case Studies →",
                href: "https://thykingdomcomeproductions.com/event-led-displays/"
            }
        },
        cta: {
            headline: "📊 Want a Custom Venue ROI Analysis?",
            description: "We'll show you exactly how much revenue your LED video wall investment can generate based on your event calendar and booking rates.",
            primaryButton: { text: "Schedule ROI Consultation", link: TKCP_CONFIG.phoneLink },
            secondaryButton: { text: "Download Venue Success Stories →", link: "https://thykingdomcomeproductions.com/portfolio" },
            trustSignal: "Installed in premium venues across 12 states"
        }
    }
};


const Section4_Considerations: React.FC<SectionProps> = ({ sector }) => {
    const relevantContent = content[sector];
    const testimonial = relevantContent.testimonial;
    const cta = relevantContent.cta;

    return (
        <div className="animate-fade-in-up">
            <h2 className="text-3xl font-display font-bold text-gray-800 dark:text-gray-100">4. Your <a href="https://thykingdomcomeproductions.com/church-led-walls/" target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>LED Transformation</a>: Sector-Specific Applications</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{relevantContent.subtitle}</p>

            {/* Key Impact Areas */}
            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-700">
                <h3 className="text-xl font-bold font-display text-gray-800 dark:text-gray-100 mb-4">Key Impact Areas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {relevantContent.applications.map((app, index) => (
                        <div key={index} className="flex items-start gap-3">
                            <span className="text-2xl mt-1">{app.emoji}</span>
                            <div>
                                <h4 className="font-semibold text-gray-800 dark:text-gray-200">{app.title}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{app.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Financial Impact Section */}
            <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="text-xl font-bold font-display text-green-800 dark:text-green-200">{relevantContent.financialImpact.title}</h3>
                <ul className="mt-4 space-y-2 list-disc list-inside text-green-700 dark:text-green-300">
                    {relevantContent.financialImpact.points.map((point, index) => (
                        <li key={index}>{point}</li>
                    ))}
                </ul>
            </div>

            {/* Success Story */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold font-display text-gray-800 dark:text-gray-100 text-center mb-4">Success Story</h3>
                <div
                    className="relative min-h-[300px] bg-cover bg-center rounded-lg shadow-lg flex items-center justify-center text-center overflow-hidden"
                    style={{ backgroundImage: `url(${testimonial.imageUrl})` }}
                    role="img"
                    aria-label={testimonial.imageAlt}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                    <blockquote className="relative z-10 p-8 text-white max-w-2xl">
                        <p className="text-lg md:text-xl italic [text-shadow:_0_1px_3px_rgba(0,0,0,0.5)]">
                            "{testimonial.quote}"
                        </p>
                        <cite className="block text-right mt-4 not-italic font-semibold text-gray-200 [text-shadow:_0_1px_2px_rgba(0,0,0,0.5)]">
                            — {testimonial.author}, <br/> {testimonial.org}
                        </cite>
                        <div className="text-right mt-4 not-italic">
                            <a href={testimonial.link.href} target="_blank" rel="noopener noreferrer" className="font-semibold text-church-accent hover:text-yellow-300 transition-colors underline">
                                {testimonial.link.text}
                            </a>
                        </div>
                    </blockquote>
                </div>
            </div>

            {/* Enhanced CTA */}
            <div className="mt-12 p-6 bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
                <h3 className="text-2xl font-display font-bold text-gray-800 dark:text-gray-100">{cta.headline}</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-xl mx-auto">{cta.description}</p>
                <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <a
                        href={cta.primaryButton.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-church-primary text-white font-bold rounded-md hover:bg-church-primary/90 transition-transform hover:scale-105 shadow-md"
                    >
                        {cta.primaryButton.text}
                    </a>
                    <a
                        href={cta.secondaryButton.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${LINK_CLASS} font-semibold`}
                    >
                        {cta.secondaryButton.text}
                    </a>
                </div>
                 <p className="mt-6 text-sm font-semibold text-gray-500 dark:text-gray-400">{cta.trustSignal}</p>
            </div>
        </div>
    );
};

export default Section4_Considerations;