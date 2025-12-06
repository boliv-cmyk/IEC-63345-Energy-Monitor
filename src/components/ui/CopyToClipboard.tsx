
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface Props {
    text: string | number | undefined;
    className?: string;
    iconSize?: number;
}

export const CopyToClipboard: React.FC<Props> = ({ text, className, iconSize = 14 }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (text === undefined || text === null) return;
        
        try {
            await navigator.clipboard.writeText(text.toString());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    if (text === undefined || text === null) return null;

    return (
        <div className="relative inline-block group/copy">
            <button 
                onClick={handleCopy}
                className={`p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 ${className || ''}`}
                aria-label="Copy value"
            >
                {copied ? (
                    <Check size={iconSize} className="text-emerald-500" />
                ) : (
                    <Copy size={iconSize} />
                )}
            </button>
            
            {/* Success Tooltip */}
            <div 
                className={`
                    absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 
                    bg-slate-800 text-white text-[10px] rounded opacity-0 transition-opacity pointer-events-none whitespace-nowrap
                    ${copied ? 'opacity-100' : 'group-hover/copy:opacity-100'}
                `}
            >
                {copied ? 'Copied!' : 'Copy'}
                {/* Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
            </div>
        </div>
    );
};
