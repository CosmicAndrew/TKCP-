
import React, { useState } from 'react';
import { Result, Sector } from '../../../types';
import { ASSESSMENT_QUESTIONS, TKCP_CONFIG } from '../../../constants';
import * as HubSpot from '../../../services/hubspot';
import { IconPrint, IconCheckCircle, IconSpinner } from '../../common/Icon';
import ScoreGauge from '../../common/ScoreGauge';


interface SectionProps {
    sector: Sector;
    result: Result;
}

// Placeholder for Meta Pixel tracking
const trackMetaEvent = (eventName: string, params: object = {}) => {
    console.log(`[Meta Pixel Event]: ${eventName}`, params);
};


const Section7_Summary: React.FC<SectionProps> = ({ sector, result }) => {
    const { answers, score, maxScore, userData, leadStatus, geminiInsights } = result;
    const [isGenerating, setIsGenerating] = useState(false);
    const [loadingText, setLoadingText] = useState('');

    const findAnswerText = (questionIndex: number, answerValue: string | undefined) => {
        if (answerValue === undefined) return 'N/A';
        const question = ASSESSMENT_QUESTIONS[questionIndex];
        const option = question.options.find(o => o.value === answerValue);
        return option ? option.text[sector] : 'N/A';
    };

    const painLevel = findAnswerText(0, answers[0]?.value);
    const orgSize = findAnswerText(1, answers[1]?.value);
    const timeline = findAnswerText(2, answers[2]?.value);
    const compellingEvent = findAnswerText(3, answers[3]?.value);
    const date = new Date().toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const handleGeneratePdf = async () => {
        trackMetaEvent('Download', { content_type: 'buyers_guide_summary' });
        HubSpot.trackEvent('Generated PDF Summary', HubSpot.getSessionUserId());
        const input = document.getElementById('printable-summary');
        if (input) {
            setIsGenerating(true);
            try {
                setLoadingText('Loading libraries...');
                const { jsPDF } = await import('jspdf');
                const html2canvas = (await import('html2canvas')).default;
                
                setLoadingText('Processing document...');
                const canvas = await html2canvas(input, { scale: 2 });
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                
                setLoadingText('Saving file...');
                await new Promise(res => setTimeout(res, 500)); // Brief delay for UX

                pdf.save(`TKCP_LED_Summary_${userData.lastName || 'Client'}.pdf`);
            } catch (error) {
                console.error("PDF Generation failed:", error);
                alert("Sorry, there was an error generating the PDF. Please try again.");
            } finally {
                setIsGenerating(false);
            }
        }
    };


    return (
        <div className="animate-fade-in-up">
            {/* For dark mode, this container matches the main content background. Print styles will force a white background. */}
            <div id="printable-summary" className="bg-white dark:bg-gray-800 p-4">
                <header className="print-header mb-6 text-center border-b-2 border-church-primary dark:border-church-accent pb-4">
                     <img src={TKCP_CONFIG.logoBase64} alt="TKCP Logo" className="mx-auto h-12 mb-2" />
                    <h1 className="text-3xl font-display font-bold text-church-primary dark:text-blue-300">Personal LED Assessment Summary</h1>
                     <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        <p>{TKCP_CONFIG.companyName} | {TKCP_CONFIG.phone} | {TKCP_CONFIG.website}</p>
                        <p className="mt-1">
                            Prepared for: <strong>{userData.firstName || userData.fullName || 'Valued Client'}</strong> | Generated: <strong>{date}</strong>
                        </p>
                    </div>
                </header>
                
                <div className="md:flex md:gap-8">
                     <section className="assessment-recap mb-6 flex-1">
                        <h2 className="text-xl font-display font-bold text-gray-800 dark:text-gray-100 mb-4">Your Assessment Results</h2>
                         <table className="results-table w-full border-collapse text-gray-700 dark:text-gray-300">
                            <tbody>
                                <tr><td className="p-2 border border-gray-300 dark:border-gray-600 font-semibold text-gray-800 dark:text-gray-100">Organization Size:</td><td className="p-2 border border-gray-300 dark:border-gray-600">{orgSize}</td></tr>
                                <tr><td className="p-2 border border-gray-300 dark:border-gray-600 font-semibold text-gray-800 dark:text-gray-100">Current Pain Level:</td><td className="p-2 border border-gray-300 dark:border-gray-600">{painLevel}</td></tr>
                                <tr><td className="p-2 border border-gray-300 dark:border-gray-600 font-semibold text-gray-800 dark:text-gray-100">Project Timeline:</td><td className="p-2 border border-gray-300 dark:border-gray-600">{timeline}</td></tr>
                                <tr><td className="p-2 border border-gray-300 dark:border-gray-600 font-semibold text-gray-800 dark:text-gray-100">Primary Driver:</td><td className="p-2 border border-gray-300 dark:border-gray-600">{compellingEvent}</td></tr>
                                <tr><td className="p-2 border border-gray-300 dark:border-gray-600 font-semibold text-gray-800 dark:text-gray-100">Lead Score:</td><td className="p-2 border border-gray-300 dark:border-gray-600">{score}/{maxScore} ({leadStatus.charAt(0).toUpperCase() + leadStatus.slice(1)})</td></tr>
                            </tbody>
                        </table>
                    </section>
                    <aside className="flex-shrink-0 flex justify-center items-center mb-6 md:mb-0">
                         <ScoreGauge score={score} maxScore={maxScore} sector={sector} />
                    </aside>
                </div>


                {geminiInsights && (
                    <section className="recommendations mb-6">
                        <h2 className="text-xl font-display font-bold text-gray-800 dark:text-gray-100 mb-4">Personalized Insights & Recommendations</h2>
                        <div className="recommendation-content bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                            <p className="font-semibold text-gray-800 dark:text-gray-100">Summary:</p>
                            <p className="mb-4 text-gray-700 dark:text-gray-300">{geminiInsights.summary}</p>
                            <p className="font-semibold text-gray-800 dark:text-gray-100">Actionable Next Steps:</p>
                             <ul className="space-y-2 mt-2 text-gray-700 dark:text-gray-300">
                                {geminiInsights.actionable_steps.map((step, i) => (
                                    <li key={i} className="flex items-start">
                                        <IconCheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                )}


                <section className="next-steps">
                    <h2 className="text-xl font-display font-bold text-gray-800 dark:text-gray-100 mb-4">Your Next Steps</h2>
                    <ol className="list-decimal list-inside space-y-2 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border dark:border-gray-700 text-gray-700 dark:text-gray-300">
                        <li>Review this summary with your leadership team.</li>
                        <li>Schedule your free consultation by calling us at <a href={TKCP_CONFIG.phoneLink} className="font-bold text-church-primary hover:underline">{TKCP_CONFIG.phone}</a>.</li>
                        <li>Prepare any specific questions about your space, budget, or goals.</li>
                    </ol>
                </section>
                
                 <footer className="print-footer mt-6 pt-4 border-t dark:border-gray-700 text-center text-xs text-gray-500 dark:text-gray-400">
                    <p>© {new Date().getFullYear()} {TKCP_CONFIG.companyName} - Your Partner in Visual Excellence</p>
                </footer>
            </div>
            
            <button
                className="print-btn mt-8 w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 text-white font-semibold rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-500 disabled:cursor-wait"
                onClick={handleGeneratePdf}
                disabled={isGenerating}
            >
                {isGenerating ? (
                    <>
                        <IconSpinner className="mr-2" />
                        <span>{loadingText}</span>
                    </>
                ) : (
                    <>
                        <IconPrint className="w-5 h-5" />
                        <span>Download PDF Summary</span>
                    </>
                )}
            </button>
        </div>
    );
};

export default Section7_Summary;
