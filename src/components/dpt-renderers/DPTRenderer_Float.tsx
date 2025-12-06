
import React from 'react';
import { DPT_Float_F16 } from '../../iec-types/dpt-float';
import { formatDPTFloat } from '../../utils/formatters/formatDPTFloat';

interface Props {
    value: DPT_Float_F16 | undefined;
    unit?: string;
    label?: string;
    className?: string;
}

export const DPTRenderer_Float: React.FC<Props> = ({ value, unit, label, className }) => {
    const formatted = formatDPTFloat(value);
    
    // Check validity based on formatted output or raw
    const isValid = formatted !== 'Invalid' && formatted !== '-';

    return (
        <div className={`flex flex-col ${className || ''}`}>
            {label && <span className="text-xs text-slate-500 uppercase font-semibold mb-0.5">{label}</span>}
            <div className="flex items-baseline">
                <span className={`font-mono font-medium ${isValid ? 'text-slate-900' : 'text-slate-400 italic'}`}>
                    {formatted}
                </span>
                {isValid && unit && <span className="ml-1 text-sm text-slate-500">{unit}</span>}
            </div>
        </div>
    );
};
