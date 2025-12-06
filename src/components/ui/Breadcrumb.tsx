
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    onClick?: () => void;
}

interface Props {
    items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<Props> = ({ items }) => {
    return (
        <nav className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
            <button 
                onClick={items[0]?.onClick}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center"
            >
                <Home size={14} className="mr-1" />
                <span className="sr-only">Home</span>
            </button>
            
            {items.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <ChevronRight size={14} className="text-slate-300 dark:text-slate-600" />
                    {item.onClick && index < items.length - 1 ? (
                        <button 
                            onClick={item.onClick}
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                        >
                            {item.label}
                        </button>
                    ) : (
                        <span className="font-semibold text-slate-800 dark:text-slate-200 cursor-default">
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </nav>
    );
};
