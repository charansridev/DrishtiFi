import React, { useState } from 'react';
import type { ReportData, FinancialEstimate } from '../types';
import { CheckCircleIcon, AlertTriangleIcon, ArrowLeftIcon, FileTextIcon } from './IconComponents';

const ReportSection: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 border-b-2 border-slate-200 dark:border-slate-700 pb-2 mb-3 print-light-text print-light-border">{title}</h3>
    <div className="text-slate-600 dark:text-slate-300 space-y-2 print-light-text-soft">{children}</div>
  </div>
);

const TrustScoreBadge: React.FC<{ score: string; summary: string }> = ({ score, summary }) => {
    let scoreColor = 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200';
    if (score.startsWith('A')) scoreColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 print-badge-high';
    if (score.startsWith('B')) scoreColor = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 print-badge-medium';
    if (score.startsWith('C') || score.startsWith('D')) scoreColor = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 print-badge-low';

    let summaryColor = 'bg-slate-500';
    if (summary.toLowerCase().includes('low risk')) summaryColor = 'bg-emerald-500';
    if (summary.toLowerCase().includes('medium risk')) summaryColor = 'bg-yellow-500';
    if (summary.toLowerCase().includes('high risk')) summaryColor = 'bg-red-500';

    return (
        <div className="flex items-center gap-4">
            <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold print-light-text-soft">TRUST SCORE</p>
                <p className={`text-3xl font-bold px-3 py-1 rounded ${scoreColor} print-badge`}>{score}</p>
            </div>
            <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold print-light-text-soft">RECOMMENDATION</p>
                <p className={`text-sm font-bold text-white px-2 py-1 rounded-full ${summaryColor}`}>{summary.toUpperCase()}</p>
            </div>
        </div>
    );
};

const FinancialEstimatesTable: React.FC<{ estimates: FinancialEstimate[] }> = ({ estimates }) => {
    const getConfidenceColor = (confidence: string) => {
        switch (confidence.toLowerCase()) {
            case 'high': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 print-badge-high';
            case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 print-badge-medium';
            case 'low': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 print-badge-low';
            default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200';
        }
    };
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg print-light print-light-border">
                <thead className="bg-slate-50 dark:bg-slate-700 print-light-table-header">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider print-light-text-soft">Metric</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider print-light-text-soft">AI-Estimated Value</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider print-light-text-soft">Confidence</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700 print-light-border">
                    {estimates.map((item, index) => (
                        <tr key={index}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-800 dark:text-slate-100 print-light-text">{item.metric}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300 print-light-text-soft">{item.value}</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getConfidenceColor(item.confidence)} print-badge`}>
                                    {item.confidence}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const generateTextContent = (data: ReportData): string => {
  let content = `DrishtiFi: Digital Credit-Readiness Report\n`;
  content += `=========================================\n\n`;
  content += `Shop Name: ${data.shop_name}\n`;
  content += `Report ID: ${data.id}\n`;
  content += `Date of Analysis: ${data.analysisDate}\n\n`;
  content += `-----------------------------------------\n`;
  content += `OVERVIEW\n`;
  content += `-----------------------------------------\n`;
  content += `Trust Score: ${data.trust_score}\n`;
  content += `Recommendation: ${data.recommendation_summary.toUpperCase()}\n\n`;
  content += `Executive Summary:\n${data.executive_summary}\n\n`;

  content += `-----------------------------------------\n`;
  content += `AI-POWERED FINANCIAL ESTIMATES\n`;
  content += `-----------------------------------------\n`;
  data.financial_estimates.forEach(est => {
    content += `- ${est.metric}: ${est.value} (Confidence: ${est.confidence})\n`;
  });
  content += `\n`;

  content += `-----------------------------------------\n`;
  content += `DETAILED ANALYSIS\n`;
  content += `-----------------------------------------\n\n`;
  content += `Positive Indicators (Strengths):\n`;
  data.positive_indicators.forEach(item => {
    content += `  - ${item}\n`;
  });
  content += `\n`;

  content += `Risks & Concerns (Weaknesses):\n`;
  data.risks_or_concerns.forEach(item => {
    content += `  - ${item}\n`;
  });
  content += `\n`;

  content += `-----------------------------------------\n`;
  content += `FINAL RECOMMENDATION & RATIONALE\n`;
  content += `-----------------------------------------\n`;
  content += `${data.final_recommendation_and_rationale}\n\n`;

  content += `-----------------------------------------\n`;
  content += `Disclaimer: This is an AI-generated assessment based on visual data. All financial decisions should be made in conjunction with standard due diligence by a human loan officer.\n`;
  
  return content;
};


export const ReportDisplay: React.FC<{ data: ReportData; onBack: () => void; }> = ({ data, onBack }) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState<string | null>(null);

    const handleDownloadText = () => {
        if (isDownloading) return;
        setIsDownloading(true);
        setDownloadError(null);

        try {
            const textContent = generateTextContent(data);
            const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `DrishtiFi-Report-${data.id}.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to generate text file:", error);
            setDownloadError("Could not generate text file. Please try again.");
        } finally {
            setTimeout(() => setIsDownloading(false), 1000);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl animate-fade-in border border-slate-200 dark:border-slate-700 printable-area print-light print-light-border">
            <header className="mb-8 flex justify-between items-start">
                <div>
                    <p className="text-sm text-cyan-600 dark:text-cyan-400 font-semibold">DrishtiFi: Digital Credit-Readiness Report</p>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mt-1 print-light-text">{data.shop_name}</h2>
                    <div className="text-xs text-slate-400 dark:text-slate-500 mt-2 print-light-text-soft">
                        <span>Report ID: {data.id}</span> | <span>Date of Analysis: {data.analysisDate}</span>
                    </div>
                </div>
                <div className="no-print">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-lg shadow-sm hover:bg-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-75 transition-colors">
                            <ArrowLeftIcon className="w-4 h-4" />
                            Back
                        </button>
                        
                        <button
                            onClick={handleDownloadText}
                            disabled={isDownloading}
                            className="flex items-center justify-center gap-2 w-[180px] px-4 py-2 bg-cyan-600 dark:bg-cyan-500 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 dark:hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-75 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-500 disabled:cursor-wait"
                            aria-live="polite"
                        >
                            {isDownloading ? (
                                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <FileTextIcon className="w-5 h-5" />
                            )}
                            {isDownloading ? 'Downloading...' : 'Download as Text'}
                        </button>
                    </div>
                    {downloadError && (
                        <p className="text-right mt-2 text-sm text-red-600 dark:text-red-400">
                            {downloadError}
                        </p>
                    )}
                </div>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="md:col-span-1">
                    <TrustScoreBadge score={data.trust_score} summary={data.recommendation_summary} />
                </div>
                <div className="md:col-span-2 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg print-light-card print-light-text-soft">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-1 print-light-text">Executive Summary</h4>
                    <p>{data.executive_summary}</p>
                </div>
            </div>

            <ReportSection title="AI-Powered Financial Estimates">
                <FinancialEstimatesTable estimates={data.financial_estimates} />
            </ReportSection>

            <ReportSection title="Detailed Analysis">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-md font-semibold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center print-light-text">
                            <CheckCircleIcon className="w-5 h-5 mr-2" />
                            Positive Indicators (Strengths)
                        </h4>
                        <ul className="space-y-2 pl-4">
                            {data.positive_indicators.map((item, index) => (
                                <li key={index} className="text-sm list-disc">{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-md font-semibold text-amber-700 dark:text-amber-400 mb-2 flex items-center print-light-text">
                            <AlertTriangleIcon className="w-5 h-5 mr-2" />
                            Risks & Concerns (Weaknesses)
                        </h4>
                        <ul className="space-y-2 pl-4">
                            {data.risks_or_concerns.map((item, index) => (
                                <li key={index} className="text-sm list-disc">{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </ReportSection>

            <ReportSection title="Final Recommendation & Rationale">
                <div className="bg-cyan-50 dark:bg-cyan-900/50 border-l-4 border-cyan-500 dark:border-cyan-400 text-cyan-800 dark:text-cyan-200 p-4 rounded-r-lg print-light-card print-light-text">
                    <p className="whitespace-pre-wrap">{data.final_recommendation_and_rationale}</p>
                </div>
            </ReportSection>

            <footer className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-700 text-center print-light-border">
                <p className="text-xs text-slate-400 dark:text-slate-500 print-light-text-soft">
                    Disclaimer: This is an AI-generated assessment based on visual data. All financial decisions should be made in conjunction with standard due diligence by a human loan officer.
                </p>
            </footer>
        </div>
    );
};