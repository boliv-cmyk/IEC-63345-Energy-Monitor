
import React, { useState } from 'react';

interface Props {
    content: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export const Tooltip: React.FC<Props> = ({ content, children, className }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div 
            className={`relative inline-block ${className || ''}`}
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            onFocus={() => setIsVisible(true)}
            onBlur={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-slate-900 dark:bg-slate-700 text-white text-xs rounded py-1 px-2 shadow-lg whitespace-nowrap border border-slate-700 dark:border-slate-600">
                        {content}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-700"></div>
                    </div>
                </div>
            )}
        </div>
    );
};
