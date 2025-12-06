
import React from 'react';
import { EventLog } from './EventLog';
import { FileClock, Activity } from 'lucide-react';
import { useMDC } from '../context/MDCContext';

export const SystemLogsView: React.FC = () => {
    const { eventLog } = useMDC();
    
    // Count stats
    const errors = eventLog.filter(e => e.type === 'error').length;
    const warnings = eventLog.filter(e => e.type === 'warning').length;

    return (
        <div className="animate-in fade-in duration-300 space-y-6 h-full flex flex-col">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                        <FileClock size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">System Event Logs</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Audit trail of simulated H1 interface events, alarms, and user actions.</p>
                    </div>
                </div>
                
                <div className="mt-4 md:mt-0 flex space-x-4">
                    <div className="flex flex-col items-center px-4 border-r border-slate-100 dark:border-slate-700 last:border-0">
                        <span className="text-xs text-slate-400 uppercase font-bold">Total Events</span>
                        <span className="text-xl font-bold text-slate-700 dark:text-slate-200">{eventLog.length}</span>
                    </div>
                    <div className="flex flex-col items-center px-4 border-r border-slate-100 dark:border-slate-700 last:border-0">
                        <span className="text-xs text-slate-400 uppercase font-bold">Errors</span>
                        <span className={`text-xl font-bold ${errors > 0 ? 'text-red-500' : 'text-slate-700 dark:text-slate-200'}`}>{errors}</span>
                    </div>
                    <div className="flex flex-col items-center px-4">
                        <span className="text-xs text-slate-400 uppercase font-bold">Warnings</span>
                        <span className={`text-xl font-bold ${warnings > 0 ? 'text-amber-500' : 'text-slate-700 dark:text-slate-200'}`}>{warnings}</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-0 flex flex-col">
                <EventLog className="h-full max-h-none" /> 
            </div>
        </div>
    );
};
