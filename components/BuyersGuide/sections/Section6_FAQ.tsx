
import React, { useState } from 'react';
import { Sector, Result } from '../../../types';
import CalendarCTA from '../common/CalendarCTA';

const KeywordLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-church-primary dark:text-church-accent underline hover:text-opacity-80 transition-colors duration-300">
        {children}
    </a>
);

interface FAQItemProps {
    question: string;
    answer: React.ReactNode;
    isOpen: boolean;
    onClick: () => void;
    id: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onClick, id }) => (
    <div className="border-b dark:border-gray-700">
        <button
            onClick={onClick}
            className="w-full flex justify-between items-center text-left py-4 px-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 focus:outline-none"
            aria-expanded={isOpen}
            aria-controls={`faq-answer-${id}`}
        >
            <span className="font-semibold text-gray-800 dark:text-gray-100">{question}</span>
            <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </span>
        </button>
        <div 
            id={`faq-answer-${id}`}
            role="region"
            aria-labelledby={`faq-question-${id}`}
            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}
        >
            <div className="p-4 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50">
                {answer}
            </div>
        </div>
    </div>
);


const Section6_FAQ: React.FC<{ sector: Sector; result: Result; }> = ({ sector }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: "How long does a typical installation take?",
            answer: "Most of our installations are completed in just 1-3 days, with many being done in a single day. We know your Sunday schedule is sacred, so we work around it—scheduling installations during weekdays or off-hours to ensure zero disruption to your worship services or primary events. Our efficient, certified teams handle everything from rigging to calibration."
        },
        {
            question: "What kind of warranty is included?",
            answer: "We stand behind our work with a comprehensive 5-year parts and labor warranty. This is superior to the industry standard of 2-3 years with limited coverage, giving you complete peace of mind for your investment in new LED walls."
        },
        {
            question: "Can an LED screen be installed in our specific venue?",
            answer: "Absolutely. Our solutions are highly customizable. The process begins with a detailed Site Assessment where our engineers map out a technical plan for a perfect, seamless fit in your unique space, regardless of size or architectural challenges."
        },
        {
            question: "How difficult is it to operate the screen?",
            // FIX: The KeywordLink component was missing its children prop. Provided "church LED displays" as the child content.
            answer: <span>We prioritize user-friendly systems. Our <KeywordLink href="https://thykingdomcomeproductions.com/church-led-walls/">church LED displays</KeywordLink> integrate perfectly with software like ProPresenter, which is standard in the {sector === 'church' ? 'worship' : 'events'} world. We provide full training to ensure anyone on your team can learn it in minutes.</span>
        },
        {
            question: "Is financing available?",
            answer: "Yes, we offer flexible financing and leasing options to make your vision a reality. Complete systems start at just $11,950, and we'll work with you to find a financial solution that fits your budget."
        }
    ];

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="animate-fade-in-up">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-800 dark:text-gray-100">6. Frequently Asked Questions</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Get answers to the most common questions about LED technology and the TKCP process.</p>
            
            <div className="mt-8 border-t dark:border-gray-700">
                {faqs.map((faq, index) => (
                    <FAQItem
                        key={index}
                        id={String(index)}
                        question={faq.question}
                        answer={faq.answer}
                        isOpen={openIndex === index}
                        onClick={() => handleToggle(index)}
                    />
                ))}
            </div>

            <CalendarCTA
                headline="🙋 Have More Questions?"
                buttonText="Book a Q&A Session"
                meetingType="discovery"
            />
        </div>
    );
};

export default Section6_FAQ;