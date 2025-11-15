import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { generateCreditReport } from './services/geminiService';
import { getReportsForUser, saveReportsForUser } from './services/reportService';
import type { ReportData } from './types';
import { DrishtiFiLogo, UploadIcon, ArrowLeftIcon } from './components/IconComponents';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ReportDisplay } from './components/ReportDisplay';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { ConfirmDialog } from './components/ConfirmDialog';
import { ThemeToggle } from './components/ThemeToggle';

type View = 'login' | 'dashboard' | 'new_report' | 'view_report' | 'loading';
type Theme = 'light' | 'dark';

const getInitialTheme = (): Theme => {
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const FileInput: React.FC<{ id: string; label: string; file: File | null; onFileChange: (file: File) => void;}> = ({ id, label, file, onFileChange }) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFileChange(e.target.files[0]);
        }
    };

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>
            <label
                htmlFor={id}
                className="group relative flex justify-center items-center w-full h-32 px-4 transition bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-md appearance-none cursor-pointer hover:border-cyan-500 dark:hover:border-cyan-400 focus:outline-none"
            >
                <div className="flex flex-col items-center space-y-2 text-slate-500 dark:text-slate-400">
                    <UploadIcon className="w-8 h-8"/>
                    {file ? (
                        <span className="font-medium text-cyan-600 dark:text-cyan-400 break-all">{file.name}</span>
                    ) : (
                        <span className="font-medium">
                            Click to upload a file
                        </span>
                    )}
                </div>
                <input
                    id={id}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                />
            </label>
        </div>
    );
};


export default function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [userReports, setUserReports] = useState<ReportData[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [view, setView] = useState<View>('login');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Form state
  const [shopName, setShopName] = useState<string>('');
  const [inventoryImage, setInventoryImage] = useState<File | null>(null);
  const [ledgerImage, setLedgerImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const isFormValid = useMemo(() => {
    return shopName.trim() !== '' && inventoryImage !== null && ledgerImage !== null;
  }, [shopName, inventoryImage, ledgerImage]);

  const resetForm = () => {
    setShopName('');
    setInventoryImage(null);
    setLedgerImage(null);
    setError(null);
  };
  
  const handleLoginSuccess = (username: string) => {
    setCurrentUser(username);
    setUserReports(getReportsForUser(username));
    setView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserReports([]);
    setSelectedReport(null);
    resetForm();
    setView('login');
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !currentUser) {
        setError("Please fill in all fields and upload both images.");
        return;
    }
    setError(null);
    setView('loading');

    try {
      if(inventoryImage && ledgerImage) {
        const generatedReportData = await generateCreditReport(shopName, inventoryImage, ledgerImage);
        const newReport: ReportData = {
            ...generatedReportData,
            id: `DF-${Date.now()}`,
            analysisDate: new Date().toLocaleString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
            })
        };
        const updatedReports = [...userReports, newReport];
        setUserReports(updatedReports);
        saveReportsForUser(currentUser, updatedReports);
        setSelectedReport(newReport);
        setView('view_report');
        // FIX: The form is reset on successful submission. The original implementation had a bug
        // with a stale state variable in a `finally` block, causing a TypeScript error. 
        // This is the correct place for the form reset logic.
        resetForm();
      }
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
      setView('new_report'); // Go back to form on error
    }
  }, [shopName, inventoryImage, ledgerImage, isFormValid, currentUser, userReports]);
  

  const renderContent = () => {
    switch (view) {
        case 'login':
            return <Login onLoginSuccess={handleLoginSuccess} />;
        case 'dashboard':
            return <Dashboard 
                        username={currentUser!}
                        reports={userReports}
                        onCreateNew={() => setView('new_report')}
                        onViewReport={(report) => {
                            setSelectedReport(report);
                            setView('view_report');
                        }}
                    />;
        case 'loading':
            return <LoadingSpinner />;
        case 'view_report':
            return (
                <ReportDisplay 
                    data={selectedReport!} 
                    onBack={() => { setSelectedReport(null); setView('dashboard'); }} 
                />
            );
        case 'new_report':
            return (
                <div className="w-full max-w-lg">
                    <button onClick={() => setView('dashboard')} className="flex items-center gap-2 text-sm font-medium text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300 mb-4 no-print">
                        <ArrowLeftIcon className="w-4 h-4" />
                        Back to Dashboard
                    </button>
                    <div className="w-full bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="shop_name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Shop Name</label>
                                <input
                                    id="shop_name"
                                    type="text"
                                    value={shopName}
                                    onChange={(e) => setShopName(e.target.value)}
                                    placeholder="e.g., Raju Kirana Store"
                                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-900 dark:text-slate-50"
                                />
                            </div>
                            
                            <FileInput id="inventory_image" label="1. Shop Inventory Photo" file={inventoryImage} onFileChange={setInventoryImage} />
                            <FileInput id="ledger_image" label="2. Handwritten Ledger Photo" file={ledgerImage} onFileChange={setLedgerImage} />

                            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

                            <button
                                type="submit"
                                // FIX: This comparison is invalid because when `view` is 'new_report', it cannot also be 'loading'.
                                // The button is unmounted when the view changes to 'loading', so this check is unnecessary.
                                disabled={!isFormValid}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:disabled:bg-slate-500 transition-colors"
                            >
                                Generate Credit-Readiness Report
                            </button>
                        </form>
                    </div>
                </div>
            );
    }
  };

  const handleConfirmLogout = () => {
    handleLogout();
    setShowLogoutConfirm(false);
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans transition-colors duration-300">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8 flex items-center gap-4 z-10 no-print">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
        {currentUser && (
            <button onClick={() => setShowLogoutConfirm(true)} className="text-sm font-medium text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors">
                Logout
            </button>
        )}
      </div>

      <header className="text-center mb-10 no-print">
        <div className="flex items-center justify-center gap-3">
          <DrishtiFiLogo className="w-10 h-10 text-cyan-600 dark:text-cyan-400" />
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 dark:text-slate-100">DrishtiFi</h1>
        </div>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
          Instantly assess the credit-worthiness of offline MSMEs using AI-powered visual analysis.
        </p>
      </header>
      
      {renderContent()}

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        onConfirm={handleConfirmLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </main>
  );
}