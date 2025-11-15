import React, { useState, useMemo } from 'react';
import type { ReportData } from '../types';
import { PlusIcon, SearchIcon } from './IconComponents';

interface DashboardProps {
  username: string;
  reports: ReportData[];
  onCreateNew: () => void;
  onViewReport: (report: ReportData) => void;
}

const ReportCard: React.FC<{ report: ReportData; onClick: () => void }> = ({ report, onClick }) => {
    let scoreColor = 'bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-slate-100';
    if (report.trust_score.startsWith('A')) scoreColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
    if (report.trust_score.startsWith('B')) scoreColor = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    if (report.trust_score.startsWith('C') || report.trust_score.startsWith('D')) scoreColor = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';

    return (
        <button 
            onClick={onClick}
            className="w-full text-left bg-white dark:bg-slate-700 p-4 rounded-lg shadow-md hover:shadow-lg hover:border-cyan-500 dark:hover:border-cyan-400 border border-slate-200 dark:border-slate-600 transition-all duration-200 flex items-center justify-between"
            aria-label={`View report for ${report.shop_name}`}
        >
            <div>
                <p className="font-bold text-slate-800 dark:text-slate-100">{report.shop_name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Analyzed on: {report.analysisDate}</p>
            </div>
            <div className="text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">SCORE</p>
                <p className={`text-xl font-bold px-2 py-0.5 rounded ${scoreColor}`}>{report.trust_score}</p>
            </div>
        </button>
    )
}

export const Dashboard: React.FC<DashboardProps> = ({ username, reports, onCreateNew, onViewReport }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReports = useMemo(() => {
    const sorted = [...reports].sort((a, b) => new Date(b.analysisDate).getTime() - new Date(a.analysisDate).getTime());
    if (!searchQuery.trim()) {
      return sorted;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return sorted.filter(report => 
      report.shop_name.toLowerCase().includes(lowercasedQuery) ||
      report.analysisDate.toLowerCase().includes(lowercasedQuery)
    );
  }, [reports, searchQuery]);

  return (
    <div className="w-full max-w-2xl animate-fade-in">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Welcome, {username}!</h2>
                <p className="text-slate-600 dark:text-slate-300">Here are your past credit-readiness reports.</p>
            </div>
            <button
                onClick={onCreateNew}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 dark:bg-cyan-500 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 dark:hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-75 transition-colors"
            >
                <PlusIcon className="w-5 h-5" />
                New Report
            </button>
        </div>

        {reports.length > 0 && (
            <div className="mb-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by shop name or date..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md leading-5 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                        aria-label="Search reports"
                    />
                </div>
            </div>
        )}

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-3 mb-4">
                Saved Reports ({filteredReports.length})
            </h3>
            {reports.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-slate-500 dark:text-slate-400">You haven't generated any reports yet.</p>
                    <button onClick={onCreateNew} className="mt-4 text-cyan-600 dark:text-cyan-400 font-semibold hover:underline">
                        Create your first report now
                    </button>
                </div>
            ) : filteredReports.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-slate-500 dark:text-slate-400">No reports found for "{searchQuery}".</p>
                </div>
            ) : (
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                    {filteredReports.map(report => (
                        <ReportCard key={report.id} report={report} onClick={() => onViewReport(report)} />
                    ))}
                </div>
            )}
        </div>
    </div>
  );
};