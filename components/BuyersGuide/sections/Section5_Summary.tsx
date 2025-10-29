import React from 'react';
// @ts-ignore
import { jsPDF } from 'jspdf';
// @ts-ignore
import html2canvas from 'html2canvas';
import { Result, Sector } from '../../../types';
import { ASSESSMENT_QUESTIONS, TKCP_CONFIG } from '../../../constants';
import * as HubSpot from '../../../services/hubspot';
import { IconPrint, IconCheckCircle } from '../../common/Icon';
import ScoreGauge from '../../common/ScoreGauge';


interface SectionProps {
    sector: Sector;
    result: Result;
}


const Section5_Summary: React.FC<SectionProps> = ({ sector, result }) => {
    const { answers, score, maxScore, userData, leadStatus, geminiInsights } = result;

    const findAnswerText = (questionIndex: number, answerValue: string | undefined) => {
        if (answerValue === undefined) return 'N/A';
        const question = ASSESSMENT_QUESTIONS[questionIndex];
        const option = question.options.find(o => o.value === answerValue);
        return option ? option.text[sector] : 'N/A';
    };

    const painLevel = findAnswerText(0, answers[0]?.value);
    const orgSize = findAnswerText(1, answers[1]?.value);
    const timeline = findAnswerText(2, answers[2]?.value);
    const budgetStatus = findAnswerText(3, answers[3]?.value);
    const date = new Date().toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const handleGeneratePdf = () => {
        HubSpot.trackEvent('Generated PDF Summary', HubSpot.getSessionUserId());
        const input = document.getElementById('printable-summary');
        if (input) {
            html2canvas(input, { scale: 2 }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`TKCP_LED_Summary_${userData.lastName || 'Client'}.pdf`);
            });
        }
    };


    return (
        <div className="animate-fade-in-up">
            <div id="printable-summary" className="bg-white p-4">
                <header className="print-header mb-6 text-center border-b-2 border-church-primary pb-4">
                     <img src={TKCP_CONFIG.logoBase64} alt="TKCP Logo" className="mx-auto h-12 mb-2" />
                    <h1 className="text-3xl font-display font-bold text-church-primary">Personal LED Assessment Summary</h1>
                     <div className="text-sm text-gray-500 mt-2">
                        <p>{TKCP_CONFIG.companyName} | {TKCP_CONFIG.phone} | {TKCP_CONFIG.website}</p>
                        <p className="mt-1">
                            Prepared for: <strong>{userData.firstName || userData.fullName || 'Valued Client'}</strong> | Generated: <strong>{date}</strong>
                        </p>
                    </div>
                </header>
                
                <div className="md:flex md:gap-8">
                     <section className="assessment-recap mb-6 flex-1">
                        <h2 className="text-xl font-display font-bold text-gray-800 mb-4">Your Assessment Results</h2>
                         <table className="results-table w-full border-collapse">
                            <tbody>
                                <tr><td className="p-2 border border-gray-300 font-semibold">Organization Size:</td><td className="p-2 border border-gray-300">{orgSize}</td></tr>
                                <tr><td className="p-2 border border-gray-300 font-semibold">Current Pain Level:</td><td className="p-2 border border-gray-300">{painLevel}</td></tr>
                                <tr><td className="p-2 border border-gray-300 font-semibold">Project Timeline:</td><td className="p-2 border border-gray-300">{timeline}</td></tr>
                                <tr><td className="p-2 border border-gray-300 font-semibold">Budget Status:</td><td className="p-2 border border-gray-300">{budgetStatus}</td></tr>
                                <tr><td className="p-2 border border-gray-300 font-semibold">Lead Score:</td><td className="p-2 border border-gray-300">{score}/{maxScore} ({leadStatus.charAt(0).toUpperCase() + leadStatus.slice(1)})</td></tr>
                            </tbody>
                        </table>
                    </section>
                    <aside className="flex-shrink-0 flex justify-center items-center mb-6 md:mb-0">
                         <ScoreGauge score={score} maxScore={maxScore} sector={sector} />
                    </aside>
                </div>


                {geminiInsights && (
                    <section className="recommendations mb-6">
                        <h2 className="text-xl font-display font-bold text-gray-800 mb-4">Personalized Insights & Recommendations</h2>
                        <div className="recommendation-content bg-blue-50 border border-blue-200 p-4 rounded-lg">
                            <p className="font-semibold text-gray-800">Summary:</p>
                            <p className="mb-4">{geminiInsights.summary}</p>
                            <p className="font-semibold text-gray-800">Actionable Next Steps:</p>
                             <ul className="space-y-2 mt-2">
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
                    <h2 className="text-xl font-display font-bold text-gray-800 mb-4">Your Next Steps</h2>
                    <ol className="list-decimal list-inside space-y-2 bg-gray-50 p-4 rounded-lg border">
                        <li>Review this summary with your leadership team.</li>
                        <li>Schedule your free consultation by calling us at <a href={TKCP_CONFIG.phoneLink} className="font-bold text-church-primary hover:underline">{TKCP_CONFIG.phone}</a>.</li>
                        <li>Prepare any specific questions about your space, budget, or goals.</li>
                    </ol>
                </section>
                
                 <footer className="print-footer mt-6 pt-4 border-t text-center text-xs text-gray-500">
                    <p>© {new Date().getFullYear()} {TKCP_CONFIG.companyName} - Your Partner in Visual Excellence</p>
                </footer>
            </div>
            
            <button
                className="print-btn mt-8 w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 text-white font-semibold rounded-md hover:bg-gray-800 transition-colors"
                onClick={handleGeneratePdf}
            >
                <IconPrint className="w-5 h-5" />
                Download PDF Summary
            </button>
        </div>
    );
};

export default Section5_Summary;