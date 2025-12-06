
import React, { useState, useRef, useEffect } from 'react';
import { useMDC } from '../context/MDCContext';
import { Trash2, List, FileClock, Maximize2, Minimize2 } from 'lucide-react';
import { LogEntryRow } from './ui/LogEntryRow';
import { EmptyState } from './ui/EmptyState';

interface Props {
    limit?: number;
    className?: string;
}

export const EventLog: React.FC<Props> = ({ limit, className }) => {
    const { eventLog, clearEventLog } = useMDC();
    const [isMaximized, setIsMaximized] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Watch for fullscreen changes (ESC key) to sync state
    useEffect(() => {
        const handleFSChange = () => {
            if (!document.fullscreenElement) {
                setIsMaximized(false);
            }
        };
        document.addEventListener('fullscreenchange', handleFSChange);
        return () => document.removeEventListener('fullscreenchange', handleFSChange);
    }, []);

    const toggleMaximize = async () => {
        if (!containerRef.current) return;

        if (!document.fullscreenElement) {
            try {
                await containerRef.current.requestFullscreen();
                setIsMaximized(true);
            } catch (err) {
                console.error("Error entering fullscreen:", err);
            }
        } else {
            if (document.exitFullscreen) {
                await document.exitFullscreen();
                setIsMaximized(false);
            }
        }
    };

    const displayLogs = limit && !isMaximized ? eventLog.slice(0, limit) : eventLog;

    return (
        <div 
            ref={containerRef}
            className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden animate-in slide-in-from-bottom-2 duration-500 flex flex-col ${isMaximized ? 'h-full' : ''} ${className || ''}`}
        >
            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/30 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase flex items-center">
                    <List size={16} className="mr-2 text-slate-500" />
                    System Event Log
                </h3>
                <div className="flex items-center space-x-3">
                    {eventLog.length > 0 && (
                        <button 
                            onClick={clearEventLog}
                            className="text-xs text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 flex items-center transition-colors"
                        >
                            <Trash2 size={12} className="mr-1" />
                            Clear
                        </button>
                    )}
                    <button
                        onClick={toggleMaximize}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        title={isMaximized ? "Exit Fullscreen" : "Maximize Log"}
                    >
                        {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </button>
                </div>
            </div>
            
            <div className={`overflow-y-auto ${isMaximized ? 'flex-1' : 'max-h-60 min-h-[100px]'}`}>
                {eventLog.length === 0 ? (
                    <EmptyState 
                        icon={FileClock} 
                        title="No Events Recorded" 
                        description="System operations, alarms, and status changes will appear here." 
                    />
                ) : (
                    <table className="w-full text-xs lg:text-sm text-left">
                        <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 font-medium sticky top-0 z-10">
                            <tr>
                                <th className="px-4 py-2 w-24">Time</th>
                                <th className="px-4 py-2 w-10 text-center">Type</th>
                                <th className="px-4 py-2 w-32">Source</th>
                                <th className="px-4 py-2">Message</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {displayLogs.map((entry) => (
                                <LogEntryRow key={entry.id} entry={entry} />
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            
            {limit && eventLog.length > limit && !isMaximized && (
                <div className="bg-slate-50 dark:bg-slate-700/30 px-4 py-2 text-center border-t border-slate-100 dark:border-slate-700">
                    <span className="text-xs text-slate-500 dark:text-slate-400 italic">
                        Showing last {limit} of {eventLog.length} events
                    </span>
                </div>
            )}
        </div>
    );
};
