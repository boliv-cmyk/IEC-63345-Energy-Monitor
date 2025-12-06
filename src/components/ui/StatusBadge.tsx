
import React from 'react';
import { AlertTriangle, CheckCircle, Info, ShieldAlert, WifiOff } from 'lucide-react';

export type StatusType = 'success' | 'warning' | 'error' | 'neutral' | 'info';

interface Props {
    type: StatusType;
    label: string;
    icon?: React.ReactNode;
    className?: string;
    animate?: boolean;
}

export const StatusBadge: React.FC<Props> = ({ type, label, icon, className, animate }) => {
    const getStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
            case 'warning':
                return 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
            case 'error':
                return 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
            case 'info':
                return 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
            case 'neutral':
            default:
                return 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
        }
    };

    const getDefaultIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle size={12} />;
            case 'warning': return <AlertTriangle size={12} />;
            case 'error': return <WifiOff size={12} />; // Often used for fault
            case 'info': return <Info size={12} />;
            default: return null;
        }
    };

    return (
        <span className={`
            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border
            ${getStyles()}
            ${animate ? 'animate-pulse' : ''}
            ${className || ''}
        `}>
            <span className="mr-1.5 flex items-center">
                {icon || getDefaultIcon()}
            </span>
            {label}
        </span>
    );
};
