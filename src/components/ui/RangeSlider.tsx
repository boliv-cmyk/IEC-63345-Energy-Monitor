
import React from 'react';

interface Props {
    value: number;
    min: number;
    max: number;
    step?: number;
    onChange: (value: number) => void;
    label?: string;
    unit?: string;
    disabled?: boolean;
}

export const RangeSlider: React.FC<Props> = ({ 
    value, 
    min, 
    max, 
    step = 1, 
    onChange, 
    label, 
    unit,
    disabled = false
}) => {
    return (
        <div className={`space-y-3 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="flex justify-between items-center">
                {label && (
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                        {label}
                    </label>
                )}
                <span className="text-sm font-mono font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                    {value}
                    {unit && <span className="ml-1 text-slate-400">{unit}</span>}
                </span>
            </div>
            
            <div className="relative w-full h-6 flex items-center">
                <input 
                    type="range" 
                    min={min} 
                    max={max} 
                    step={step} 
                    value={value} 
                    onChange={(e) => onChange(Number(e.target.value))}
                    disabled={disabled}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
            </div>
            
            <div className="flex justify-between text-xs text-slate-400">
                <span>{min}{unit}</span>
                <span>{max}{unit}</span>
            </div>
        </div>
    );
};
