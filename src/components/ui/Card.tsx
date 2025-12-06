
import React from 'react';

interface Props {
    children: React.ReactNode;
    className?: string;
    noPadding?: boolean;
}

export const Card: React.FC<Props> = ({ children, className, noPadding = false }) => {
    return (
        <div className={`
            bg-white dark:bg-slate-800 
            rounded-xl 
            border border-slate-200 dark:border-slate-700 
            shadow-sm 
            transition-colors duration-200
            print:border-0 print:shadow-none
            ${noPadding ? '' : 'p-6'} 
            ${className || ''}
        `}>
            {children}
        </div>
    );
};
