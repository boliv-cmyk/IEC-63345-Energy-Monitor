
import React, { memo } from 'react';
import { CopyToClipboard } from './CopyToClipboard';

interface Props {
    label: string;
    value: React.ReactNode;
    rawValue?: string | number;
    mono?: boolean;
}

const TechRowComponent: React.FC<Props> = ({ label, value, rawValue, mono }) => (
    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors px-2 -mx-2 rounded group">
        <span className="text-slate-500 dark:text-slate-400 text-sm">{label}</span>
        <div className="flex items-center">
            <span className={`text-slate-900 dark:text-slate-200 font-medium text-right mr-2 ${mono ? 'font-mono text-xs' : 'text-sm'}`}>
                {value ?? '-'}
            </span>
            {rawValue !== undefined && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                    <CopyToClipboard text={rawValue} />
                </div>
            )}
        </div>
    </div>
);

export const TechRow = memo(TechRowComponent);
