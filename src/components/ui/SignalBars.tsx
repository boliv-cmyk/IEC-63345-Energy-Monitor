
import React from 'react';

interface Props {
    quality: number; // 0 - 100
    className?: string;
}

export const SignalBars: React.FC<Props> = ({ quality, className }) => {
    const bars = 4;
    const level = Math.ceil((quality / 100) * bars);

    return (
        <div className={`flex items-end space-x-0.5 ${className || ''}`}>
            {[1, 2, 3, 4].map((bar) => {
                const isActive = bar <= level;
                let colorClass = 'bg-slate-300 dark:bg-slate-700'; // Inactive
                
                if (isActive) {
                    if (quality < 30) colorClass = 'bg-red-500';
                    else if (quality < 60) colorClass = 'bg-yellow-500';
                    else colorClass = 'bg-green-500';
                }

                // Varying heights for cellular look
                const heightClass = 
                    bar === 1 ? 'h-1.5' : 
                    bar === 2 ? 'h-2.5' : 
                    bar === 3 ? 'h-3.5' : 'h-4.5';

                return (
                    <div 
                        key={bar} 
                        className={`w-1 rounded-sm transition-colors duration-300 ${heightClass} ${colorClass}`} 
                    />
                );
            })}
        </div>
    );
};
