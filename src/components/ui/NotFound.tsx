
import React from 'react';
import { SearchX, ArrowLeft } from 'lucide-react';

interface Props {
    title?: string;
    message?: string;
    onBack?: () => void;
}

export const NotFound: React.FC<Props> = ({ 
    title = "Resource Not Found", 
    message = "The requested functional block or data point could not be located in the current H1 interface context.",
    onBack
}) => {
    return (
        <div className="flex flex-col items-center justify-center h-96 text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-full mb-6 ring-4 ring-slate-50 dark:ring-slate-700/50">
                <SearchX size={48} className="text-slate-400 dark:text-slate-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{title}</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8 leading-relaxed">
                {message}
            </p>
            {onBack && (
                <button 
                    onClick={onBack}
                    className="flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
                >
                    <ArrowLeft size={18} className="mr-2" />
                    Return to Dashboard
                </button>
            )}
        </div>
    );
};
