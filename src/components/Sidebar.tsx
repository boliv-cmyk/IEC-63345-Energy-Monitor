
import React from 'react';
import { useMDC } from '../context/MDCContext';
import { LayoutDashboard, Settings, FileClock } from 'lucide-react';
import { getMeterIcon } from './ui/Icons';
import { ConnectionStatus } from './ui/ConnectionStatus';

interface Props {
    isSidebarOpen: boolean;
    isMobile: boolean;
    selectedMeterId: string | null;
    onSelectMeter: (id: string | null) => void;
    onToggleSettings: () => void;
}

export const Sidebar: React.FC<Props> = ({ 
    isSidebarOpen, 
    isMobile, 
    selectedMeterId, 
    onSelectMeter,
    onToggleSettings 
}) => {
    const { meters, darkMode } = useMDC();

    return (
        <aside 
            className={`
                fixed lg:static inset-y-0 left-0 z-30
                w-64 transform transition-all duration-200 ease-in-out flex flex-col
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden'}
                ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}
                border-r lg:w-64 lg:block shadow-lg lg:shadow-none
                print:hidden
            `}
        >
            <div className={`h-16 flex items-center px-6 border-b ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                    <LayoutDashboard className="text-white" size={20} />
                </div>
                <span className={`font-bold text-lg tracking-tight ${darkMode ? 'text-white' : 'text-slate-800'}`}>EcoMonitor</span>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-600">
                <div className={`px-4 mb-2 text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    Main
                </div>
                <button
                    onClick={() => onSelectMeter(null)}
                    className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                        selectedMeterId === null 
                            ? 'text-blue-500 bg-blue-50/10 border-r-2 border-blue-500' 
                            : `text-slate-500 hover:text-slate-900 ${darkMode ? 'hover:bg-slate-700 hover:text-slate-200' : 'hover:bg-slate-50'}`
                    }`}
                >
                    <LayoutDashboard size={18} className="mr-3" />
                    Dashboard
                </button>
                <button
                    onClick={() => onSelectMeter('VIEW_LOGS')}
                    className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                        selectedMeterId === 'VIEW_LOGS' 
                            ? 'text-blue-500 bg-blue-50/10 border-r-2 border-blue-500' 
                            : `text-slate-500 hover:text-slate-900 ${darkMode ? 'hover:bg-slate-700 hover:text-slate-200' : 'hover:bg-slate-50'}`
                    }`}
                >
                    <FileClock size={18} className="mr-3" />
                    System Logs
                </button>

                <div className={`px-4 mt-6 mb-2 text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    Functional Blocks
                </div>
                {meters.map(meter => (
                    <button
                        key={meter._internalId}
                        onClick={() => onSelectMeter(meter._internalId)}
                        className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                            selectedMeterId === meter._internalId 
                                ? 'text-blue-500 bg-blue-50/10 border-r-2 border-blue-500' 
                                : `text-slate-500 ${darkMode ? 'hover:bg-slate-700 hover:text-slate-200' : 'hover:bg-slate-50 hover:text-slate-900'}`
                        }`}
                    >
                        <span className={`mr-3 ${selectedMeterId === meter._internalId ? 'text-blue-500' : 'text-slate-400'}`}>
                            {getMeterIcon(meter.MeteringDeviceType)}
                        </span>
                        <div className="flex flex-col items-start truncate">
                            <span className={`truncate max-w-[120px] ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{meter._name}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{meter.type}</span>
                        </div>
                    </button>
                ))}
            </nav>

            <div className={`p-4 border-t ${darkMode ? 'border-slate-700' : 'border-slate-100'} space-y-3`}>
                <ConnectionStatus />

                <button 
                    onClick={onToggleSettings}
                    className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-md transition-colors ${darkMode ? 'text-slate-400 hover:bg-slate-700 hover:text-white' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                >
                    <Settings size={18} className="mr-3" />
                    Settings
                </button>
            </div>
        </aside>
    );
};
