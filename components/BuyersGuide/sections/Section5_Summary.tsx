import React from 'react';
import { Result, Sector } from '../../../types';
import { ASSESSMENT_QUESTIONS } from '../../../constants';
import { TKCP_CONFIG } from '../../../constants';
import { IconPrint } from '../../common/Icon';

interface SectionProps {
    sector: Sector;
    result: Result;
}

const ResultItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="bg-gray-50 p-4 rounded-lg border">
        <strong className="block text-sm text-gray-500">{label}</strong>
        <span className="text-lg font-semibold text-gray-800">{value}</span>
    </div>
);

const Section5_Summary: React.FC<SectionProps> = ({ sector, result }) => {
    const { answers, score, userData } = result;

    const findAnswerText = (questionIndex: number, answerValue: string | undefined) => {
        if (answerValue === undefined) return 'N/A';
        const question = ASSESSMENT_QUESTIONS[questionIndex];
        const option = question.options.find(o => o.value === answerValue);
        return option ? option.text[sector] : 'N/A';
    };

    const orgSize = findAnswerText(1, answers[1]?.value);
    const timeline = findAnswerText(2, answers[2]?.value);
    const commitment = findAnswerText(4, answers[4]?.value);
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="animate-fade-in-up">
            <div id="printable-summary">
                <header className="print-header mb-8 text-center border-b pb-4">
                    {/* In a real app, you'd use a local image asset */}
                    <h1 className="text-3xl font-display font-bold text-church-primary">{TKCP_CONFIG.companyName}</h1>
                    <h2 className="text-2xl font-display font-semibold text-gray-700 mt-2">Your Personal LED Assessment Summary</h2>
                    <p className="text-sm text-gray-500 mt-2">
                        Prepared for: {userData.firstName || userData.fullName || 'Valued Client'} | Generated on: {date}
                    </p>
                </header>

                <section className="assessment-recap mb-8">
                    <h2 className="text-xl font-display font-bold text-gray-800 mb-4">Your Assessment Results</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <ResultItem label="Organization Size" value={orgSize} />
                        <ResultItem label="Timeline" value={timeline} />
                        <ResultItem label="Commitment Level" value={commitment} />
                         <div className="bg-church-primary text-white p-4 rounded-lg flex flex-col items-center justify-center">
                            <strong className="block text-sm opacity-80">Lead Score</strong>
                            <span className="text-3xl font-bold">{score}<span className="text-lg opacity-80">/16</span></span>
                        </div>
                    </div>
                </section>

                <section className="recommendations mb-8">
                    <h2 className="text-xl font-display font-bold text-gray-800 mb-4">Our Recommendations for {userData.organizationType ? (userData.organizationType === 'church' ? 'Your House of Worship' : 'Your Venue') : 'You'}</h2>
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                        <p>Based on your score of <strong>{score}</strong> and your stated timeline, you are a <strong>{result.leadStatus}</strong> candidate for an LED upgrade. We recommend exploring a solution with a pixel pitch between 2.6mm and 3.9mm to maximize visual impact and value for an organization of your size.</p>
                    </div>
                </section>

                <section className="next-steps">
                    <h2 className="text-xl font-display font-bold text-gray-800 mb-4">Your Next Steps</h2>
                    <ol className="list-decimal list-inside space-y-2 bg-gray-50 p-4 rounded-lg border">
                        <li>Review this summary with your leadership team.</li>
                        <li>Schedule your free consultation by calling us at <a href={TKCP_CONFIG.phoneLink} className="font-bold text-church-primary hover:underline">{TKCP_CONFIG.phone}</a>.</li>
                        <li>Prepare any specific questions about your space, budget, or goals.</li>
                    </ol>
                </section>
                
                 <footer className="print-footer mt-8 pt-4 border-t text-center text-xs text-gray-500">
                    <p>{TKCP_CONFIG.companyName} | {TKCP_CONFIG.phone} | {TKCP_CONFIG.website}</p>
                </footer>
            </div>
            
            <button
                className="print-btn mt-8 w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 text-white font-semibold rounded-md hover:bg-gray-800 transition-colors"
                onClick={() => window.print()}
            >
                <IconPrint className="w-5 h-5" />
                Print This Summary
            </button>
        </div>
    );
};

export default Section5_Summary;
