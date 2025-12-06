
import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    id: string;
    message: string;
    type: ToastType;
    onDismiss: (id: string) => void;
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ id, message, type, onDismiss, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss(id);
        }, duration);
        return () => clearTimeout(timer);
    }, [id, duration, onDismiss]);

    const getStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800';
            case 'error':
                return 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800';
            default:
                return 'bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle size={18} />;
            case 'error': return <AlertCircle size={18} />;
            default: return <Info size={18} />;
        }
    };

    return (
        <div className={`flex items-start p-4 rounded-lg border shadow-lg w-80 animate-in slide-in-from-right-full duration-300 ${getStyles()}`}>
            <div className="flex-shrink-0 mr-3 mt-0.5">
                {getIcon()}
            </div>
            <div className="flex-1 text-sm font-medium">
                {message}
            </div>
            <button 
                onClick={() => onDismiss(id)}
                className="ml-4 text-current opacity-70 hover:opacity-100 transition-opacity"
            >
                <X size={16} />
            </button>
        </div>
    );
};
