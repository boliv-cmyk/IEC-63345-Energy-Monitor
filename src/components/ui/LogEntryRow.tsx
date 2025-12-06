
import React, { memo } from 'react';
import { LogEntry } from '../../context/MDCContext';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface Props {
    entry: LogEntry;
}

const LogEntryRowComponent: React.FC<Props> = ({ entry }) => {
    const getIcon = (type: 'info' | 'warning' | 'error') => {
        switch (type) {
            case 'error': return <AlertCircle size={14} className="text-red-500" />;
            case 'warning': return <AlertTriangle size={14} className="text-amber-500" />;
            default: return <Info size={14} className="text-blue-500" />;
        }
    };

    const getRowStyle = (type: 'info' | 'warning' | 'error') => {
        switch (type) {
            case 'error': return 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30';
            case 'warning': return 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30';
            default: return 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50';
        }
    };

    return (
        <tr className={`transition-colors ${getRowStyle(entry.type)}`}>
            <td className="px-4 py-2 font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">
                {entry.timestamp.toLocaleTimeString()}
            </td>
            <td className="px-4 py-2 text-center">
                <div className="flex justify-center">{getIcon(entry.type)}</div>
            </td>
            <td className="px-4 py-2 font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[150px]" title={entry.source}>
                {entry.source}
            </td>
            <td className="px-4 py-2 text-slate-600 dark:text-slate-300">
                {entry.message}
            </td>
        </tr>
    );
};

export const LogEntryRow = memo(LogEntryRowComponent);
