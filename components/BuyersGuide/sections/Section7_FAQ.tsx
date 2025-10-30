import React, { useState } from 'react';
import { Sector, Result } from '../../../types';
import CalendarCTA from '../common/CalendarCTA';

interface FAQItemProps {
    question: string;
    answer: string;
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
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
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


const Section7_FAQ: React.FC<{ sector: Sector; result: Result; }> = ({ sector }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: "How long does a typical installation take?",
            answer: "Our certified in-house teams are incredibly efficient. A standard installation is typically completed within 2-3 days, compared to the industry average of 5-7 days. We handle everything to ensure minimal disruption to your operations."
        },
        {
            question: "What kind of warranty is included?",
            answer: "We stand behind our work with a comprehensive 5-year parts and labor warranty. This is superior to the industry standard of 2-3 years with limited coverage, giving you complete peace of mind."
        },
        {
            question: "Can an LED screen be installed in our specific venue?",
            answer: "Absolutely. Our solutions are highly customizable. The process begins with a detailed Site Assessment where our engineers map out a technical plan for a perfect, seamless fit in your unique space, regardless of size or architectural challenges."
        },
        {
            question: "How difficult is it to operate the screen?",
            answer: `We prioritize user-friendly systems. Our screens integrate perfectly with software like ProPresenter, which is standard in the ${sector === 'church' ? 'worship' : 'events'} world. We provide full training to ensure your team feels confident and empowered.`
        },
        {
            question: "Is financing available?",
            answer: "Yes, we offer flexible financing and leasing options to make your vision a reality. We work with you to find a financial solution that fits your budget and helps you realize the long-term value of your investment."
        }
    ];

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="animate-fade-in-up">
            <h2 className="text-3xl font-display font-bold text-gray-800 dark:text-gray-100">5. Frequently Asked Questions</h2>
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

export default Section7_FAQ;