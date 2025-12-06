
import React, { memo } from 'react';
import { DPT_MeteringValue } from '../../iec-types/dpt-metering-value';
import { formatMeteringValue } from '../../utils/formatters/formatMeteringValue';
import { DPTRenderer_StatusGen } from './DPTRenderer_StatusGen';

interface Props {
    value: DPT_MeteringValue | undefined;
    label?: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

const DPTRenderer_MeteringValueComponent: React.FC<Props> = ({ value, label, className, size = 'md' }) => {
    if (!value) {
        return (
            <div className={`flex flex-col ${className || ''}`}>
                {label && <span className="text-xs text-slate-400 mb-0.5">{label}</span>}
                <span className="text-slate-300">-</span>
            </div>
        );
    }

    const formattedString = formatMeteringValue(value);
    const parts = formattedString.split(' ');
    const valStr = parts[0];
    const unitStr = parts.length > 1 ? parts.slice(1).join(' ') : '';
    
    // Determine text sizes based on prop
    const valClass = size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-sm' : 'text-lg';
    const unitClass = size === 'lg' ? 'text-sm' : size === 'sm' ? 'text-[10px]' : 'text-xs';

    return (
        <div className={`flex flex-col ${className || ''}`}>
            {label && <span className="text-xs text-slate-500 font-semibold uppercase mb-1 tracking-wide">{label}</span>}
            <div className="flex items-baseline flex-wrap">
                <span className={`font-bold text-slate-900 dark:text-slate-100 mr-1 ${valClass}`}>{valStr}</span>
                {unitStr && <span className={`font-medium text-slate-500 dark:text-slate-400 ${unitClass}`}>{unitStr}</span>}
            </div>
            <DPTRenderer_StatusGen status={value.status} className="mt-1" />
        </div>
    );
};

export const DPTRenderer_MeteringValue = memo(DPTRenderer_MeteringValueComponent);
