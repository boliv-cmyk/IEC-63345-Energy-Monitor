
import React, { useState, useEffect } from 'react';
import { MDCProvider, useMDC } from './context/MDCContext';
import { ToastProvider } from './context/ToastContext';
import { Menu, X, Activity, HelpCircle } from 'lucide-react';
import DashboardOverview from './components/DashboardOverview';
import { MeterDetailContainer } from './components/MeterDetailContainer';
import { SettingsModal } from './components/SettingsModal';
import { StatusLegendModal } from './components/StatusLegendModal';
import { Breadcrumb } from './components/ui/Breadcrumb';
import { FullScreenToggle } from './components/ui/FullScreenToggle';
import { SplashScreen } from './components/ui/SplashScreen';
import { Sidebar } from './components/Sidebar';
import { SystemLogsView } from './components/SystemLogsView';
import { SessionTimeout } from './components/ui/SessionTimeout';
import { MaintenanceBanner } from './components/ui/MaintenanceBanner';

// Inner component to access Context
const AppContent: React.FC = () => {
    const { meters, darkMode, maintenanceMode } = useMDC();
    const [selectedMeterId, setSelectedMeterId] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isLegendOpen, setIsLegendOpen] = useState(false);
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth < 1024) setIsSidebarOpen(false);
            else setIsSidebarOpen(true);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (showSplash) {
        return <SplashScreen onComplete={() => setShowSplash(false)} />;
    }

    const selectedMeter = meters.find(m => m._internalId === selectedMeterId);
    const isLogsView = selectedMeterId === 'VIEW_LOGS';

    // Breadcrumb Logic
    const breadcrumbItems = [{ 
        label: 'Dashboard', 
        onClick: () => setSelectedMeterId(null) 
    }];
    
    if (selectedMeter) {
        breadcrumbItems.push({ 
            label: selectedMeter._name,
            onClick: undefined 
        });
    } else if (isLogsView) {
        breadcrumbItems.push({
            label: 'System Logs',
            onClick: undefined
        });
    }

    const renderContent = () => {
        if (selectedMeterId === null) {
            return <DashboardOverview onSelectMeter={setSelectedMeterId} />;
        }
        if (isLogsView) {
            return <SystemLogsView />;
        }
        if (selectedMeter) {
            return <MeterDetailContainer meterId={selectedMeter._internalId} />;
        }
        return (
            <div className="text-center py-20 text-slate-400 dark:text-slate-500">
                <Activity size={48} className="mx-auto mb-4 opacity-50" />
                <p>Select a functional block to view details</p>
            </div>
        );
    };

    const getPageTitle = () => {
        if (selectedMeter) return selectedMeter._name;
        if (isLogsView) return 'System Logs';
        return 'System Overview';
    };

    return (
        <div className={`flex h-screen overflow-hidden font-sans transition-colors duration-200 ${darkMode ? 'dark bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
            {/* Kiosk Security Overlay */}
            <SessionTimeout timeoutMinutes={5} />

            {isMobile && isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-20 backdrop-blur-sm print:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
            <StatusLegendModal isOpen={isLegendOpen} onClose={() => setIsLegendOpen(false)} />

            <Sidebar 
                isSidebarOpen={isSidebarOpen}
                isMobile={isMobile}
                selectedMeterId={selectedMeterId}
                onSelectMeter={(id) => {
                    setSelectedMeterId(id);
                    if(isMobile) setIsSidebarOpen(false);
                }}
                onToggleSettings={() => setIsSettingsOpen(true)}
            />

            <main className={`flex-1 flex flex-col min-w-0 overflow-hidden ${darkMode ? 'bg-slate-900' : 'bg-slate-50/50'}`}>
                {maintenanceMode && <MaintenanceBanner />}
                
                <header className={`h-16 border-b flex items-center justify-between px-4 lg:px-8 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} print:hidden`}>
                    <div className="flex items-center">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className={`p-2 rounded-md lg:hidden focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                        >
                            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        <h1 className={`text-xl font-semibold ml-2 lg:ml-0 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                            {getPageTitle()}
                        </h1>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                         <div className={`hidden sm:flex items-center text-xs px-3 py-1 rounded-full ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-500'}`}>
                            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                            IEC 63345 Live
                         </div>
                         
                         <button
                            onClick={() => setIsLegendOpen(true)}
                            className="p-2 rounded-full text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            title="Help & Legend"
                         >
                            <HelpCircle size={20} />
                         </button>

                         <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>
                         <FullScreenToggle />
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-4 lg:p-8 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
                    <div className="max-w-7xl mx-auto h-full flex flex-col">
                        <div className="print:hidden shrink-0">
                            <Breadcrumb items={breadcrumbItems} />
                        </div>
                        
                        <div className="flex-1 min-h-0">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <ToastProvider>
            <MDCProvider>
                <AppContent />
            </MDCProvider>
        </ToastProvider>
    );
};

export default App;
