
import React from 'react';
import { DPT_DateTime } from '../../iec-types/dpt-datetime';
import { formatDPTDateTime } from '../../utils/formatters/formatDPTDateTime';
import { Clock, AlertTriangle, CloudOff } from 'lucide-react';

interface Props {
    value: DPT_DateTime | undefined;
    label?: string;
    className?: string;
    compact?: boolean;
}

export const DPTRenderer_DateTime: React.FC<Props> = ({ value, label, className, compact }) => {
    if (!value) {
        return <span className="text-slate-300">-</span>;
    }

    const timeStr = formatDPTDateTime(value);
    const hasIssues = value.fault || value.qualityOfClock === 0;

    if (compact) {
        return (
            <div className={`flex items-center space-x-2 ${className || ''} ${hasIssues ? 'text-amber-600' : 'text-slate-700'}`}>
                <span className="font-mono text-sm">{timeStr}</span>
                {value.fault && <AlertTriangle size={12} className="text-red-500" />}
                {value.qualityOfClock === 0 && <CloudOff size={12} className="text-amber-500" />}
            </div>
        );
    }

    return (
        <div className={`bg-slate-50 rounded-lg p-2 border border-slate-100 ${className || ''}`}>
            {label && <div className="text-xs text-slate-500 mb-1">{label}</div>}
            <div className="flex items-center justify-between">
                <div className="flex items-center text-slate-800">
                    <Clock size={16} className="mr-2 text-slate-400" />
                    <span className="font-mono font-medium">{timeStr}</span>
                </div>
                <div className="flex space-x-1">
                    {value.standardSummerTime === 1 && (
                        <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] rounded font-bold uppercase" title="Summer Time">
                            DST
                        </span>
                    )}
                    {value.qualityOfClock === 0 && (
                        <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] rounded font-bold uppercase flex items-center" title="No External Sync">
                            <CloudOff size={10} className="mr-1" />
                            NoSync
                        </span>
                    )}
                    {value.fault && (
                        <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] rounded font-bold uppercase flex items-center">
                            <AlertTriangle size={10} className="mr-1" />
                            Fault
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
