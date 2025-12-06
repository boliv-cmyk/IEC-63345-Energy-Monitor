
import React from 'react';

interface Props {
    value: number;
    max: number;
    threshold?: number;
    unit: string;
    label: string;
    className?: string;
}

export const PowerGauge: React.FC<Props> = ({ value, max, threshold, unit, label, className }) => {
    // SVG Geometry
    const radius = 80;
    const stroke = 12;
    const center = 100;
    const circumference = Math.PI * radius; // Half circle
    
    // Clamp value
    const clampedValue = Math.min(Math.max(0, value), max);
    const percentage = clampedValue / max;
    const offset = circumference * (1 - percentage);

    // Threshold Marker
    let thresholdRot = 0;
    if (threshold) {
        thresholdRot = (Math.min(threshold, max) / max) * 180;
    }

    // Color logic
    let color = 'text-blue-500';
    if (threshold) {
        if (value > threshold) color = 'text-red-500';
        else if (value > threshold * 0.8) color = 'text-amber-500';
        else color = 'text-emerald-500';
    }

    return (
        <div className={`relative flex flex-col items-center ${className || ''}`}>
            <svg width="200" height="120" viewBox="0 0 200 120" className="overflow-visible">
                {/* Background Arc */}
                <path
                    d={`M20,100 A${radius},${radius} 0 0,1 180,100`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={stroke}
                    className="text-slate-100 dark:text-slate-700"
                    strokeLinecap="round"
                />
                
                {/* Value Arc */}
                <path
                    d={`M20,100 A${radius},${radius} 0 0,1 180,100`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={stroke}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className={`${color} transition-all duration-500 ease-out`}
                    strokeLinecap="round"
                />

                {/* Threshold Marker */}
                {threshold && (
                    <g transform={`translate(${center}, 100) rotate(${thresholdRot - 90}) translate(-${center}, -100)`}>
                        <line 
                            x1={center} y1={100 - radius - stroke} 
                            x2={center} y2={100 - radius + stroke} 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            className="text-red-500/50"
                        />
                    </g>
                )}
            </svg>
            
            {/* Value Text */}
            <div className="absolute bottom-0 text-center">
                <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider">{label}</div>
                <div className="flex items-baseline justify-center">
                    <span className={`text-3xl font-bold ${color}`}>{value.toFixed(2)}</span>
                    <span className="text-sm text-slate-500 ml-1 font-medium">{unit}</span>
                </div>
            </div>
        </div>
    );
};
