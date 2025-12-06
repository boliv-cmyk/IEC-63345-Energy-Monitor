
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Props {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: React.ReactNode;
}

export const EmptyState: React.FC<Props> = ({ icon: Icon, title, description, action }) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in duration-500">
            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-full mb-4 ring-1 ring-slate-100 dark:ring-slate-700">
                <Icon size={32} className="text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 mb-1">{title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mb-6 mx-auto leading-relaxed">{description}</p>
            {action}
        </div>
    );
};
