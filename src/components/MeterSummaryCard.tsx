
import React, { memo } from 'react';
import { IEC_Meter, useMDC } from '../context/MDCContext';
import { Zap, Flame, Thermometer, Droplets, Activity, Power, ShieldAlert, Sliders, ArrowRight, Shield } from 'lucide-react';
import { BreakerValveState } from '../iec-types/enums';
import { formatDPTFloat } from '../utils/formatters/formatDPTFloat';
import { formatMeteringValue } from '../utils/formatters/formatMeteringValue';
import { useMeterStatus } from '../hooks/useMeterStatus';
import { StatusBadge } from './ui/StatusBadge';

interface Props {
    meter: IEC_Meter;
    onClick: (id: string) => void;
    compact?: boolean;
}

const MeterSummaryCardComponent: React.FC<Props> = ({ meter, onClick, compact }) => {
    // If props are passed explicitly use them, otherwise check context
    const { compactMode } = useMDC();
    const isCompact = compact !== undefined ? compact : compactMode;

    const { isReliable, inAlarm } = useMeterStatus(meter);

    const getMeterSummary = (m: IEC_Meter) => {
        switch (m.type) {
            case 'M_ELECM':
                return {
                    value: formatDPTFloat(m.CurrentActivePowerConsumption),
                    unit: 'kW',
                    secondary: `${(m.CurrentEnergyConsumption / 1000).toLocaleString()} kWh`,
                    color: 'text-amber-500 dark:text-amber-400',
                    bg: 'bg-amber-50 dark:bg-amber-900/30',
                    icon: <Zap className="text-amber-600 dark:text-amber-400" size={isCompact ? 18 : 24} />
                };
            case 'M_GASM':
                return {
                    value: formatDPTFloat(m.CurrentVolumeFlow),
                    unit: 'm³/h',
                    secondary: formatMeteringValue(m.CurrentVolumeConsumption),
                    color: 'text-emerald-500 dark:text-emerald-400',
                    bg: 'bg-emerald-50 dark:bg-emerald-900/30',
                    icon: <Flame className="text-emerald-600 dark:text-emerald-400" size={isCompact ? 18 : 24} />
                };
            case 'M_HEATM':
                return {
                    value: formatMeteringValue(m.CurrentPower),
                    unit: '',
                    secondary: `Flow: ${formatDPTFloat(m.TempFlowWater)}°C`,
                    color: 'text-rose-500 dark:text-rose-400',
                    bg: 'bg-rose-50 dark:bg-rose-900/30',
                    icon: <Thermometer className="text-rose-600 dark:text-rose-400" size={isCompact ? 18 : 24} />
                };
            case 'M_WATERM':
                return {
                    value: formatDPTFloat(m.CurrentVolumeFlow),
                    unit: 'm³/h',
                    secondary: formatMeteringValue(m.CurrentVolumeConsumption),
                    color: 'text-blue-500 dark:text-blue-400',
                    bg: 'bg-blue-50 dark:bg-blue-900/30',
                    icon: <Droplets className="text-blue-600 dark:text-blue-400" size={isCompact ? 18 : 24} />
                };
            case 'M_HCA':
                return {
                    value: formatMeteringValue(m.CurrentEnergyConsumption),
                    unit: '',
                    secondary: `Room: ${formatDPTFloat(m.TempExternal)}°C`,
                    color: 'text-orange-500 dark:text-orange-400',
                    bg: 'bg-orange-50 dark:bg-orange-900/30',
                    icon: <Sliders className="text-orange-600 dark:text-orange-400" size={isCompact ? 18 : 24} />
                };
            case 'M_BREAKERM':
                return {
                    value: m.BreakerState === BreakerValveState.Closed ? 'CLOSED' : 'OPEN',
                    unit: '',
                    secondary: 'Circuit Protection',
                    color: m.BreakerState === BreakerValveState.Closed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
                    bg: m.BreakerState === BreakerValveState.Closed ? 'bg-green-50 dark:bg-green-900/30' : 'bg-red-50 dark:bg-red-900/30',
                    icon: <Power className={m.BreakerState === BreakerValveState.Closed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} size={isCompact ? 18 : 24} />
                };
            case 'M_VALVEM':
                const isOpen = m.ValveState === BreakerValveState.Open;
                return {
                    value: !isOpen ? 'ACTIVE' : 'CUTOFF',
                    unit: '',
                    secondary: 'Flow Control',
                    color: !isOpen ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
                    bg: !isOpen ? 'bg-green-50 dark:bg-green-900/30' : 'bg-red-50 dark:bg-red-900/30',
                    icon: <ShieldAlert className={!isOpen ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} size={isCompact ? 18 : 24} />
                };
            case 'M_GENERICM':
                return {
                    value: formatMeteringValue(m.CurrentConsumption),
                    unit: '',
                    secondary: 'Generic Meter',
                    color: 'text-slate-600 dark:text-slate-400',
                    bg: 'bg-slate-100 dark:bg-slate-800',
                    icon: <Activity className="text-slate-600 dark:text-slate-400" size={isCompact ? 18 : 24} />
                };
            default:
                return {
                    value: '-',
                    unit: '',
                    secondary: 'Unknown',
                    color: 'text-slate-500 dark:text-slate-400',
                    bg: 'bg-slate-50 dark:bg-slate-800',
                    icon: <Activity className="text-slate-600 dark:text-slate-400" size={isCompact ? 18 : 24} />
                };
        }
    };

    const summary = getMeterSummary(meter);

    if (isCompact) {
        return (
            <div 
                onClick={() => onClick(meter._internalId)}
                className={`
                    relative rounded-lg border p-3 shadow-sm hover:shadow-md transition-all cursor-pointer group flex items-center justify-between
                    ${inAlarm 
                        ? 'bg-white dark:bg-slate-800 border-red-200 dark:border-red-900/50 ring-1 ring-red-100 dark:ring-red-900/20' 
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500'}
                `}
            >
                <div className="flex items-center">
                    <div className={`p-2 rounded-lg mr-3 ${summary.bg}`}>
                        {summary.icon}
                    </div>
                    <div>
                        <h3 className="text-slate-500 dark:text-slate-400 font-semibold text-[10px] uppercase tracking-wide truncate max-w-[100px]">
                            {meter._name}
                        </h3>
                        <div className="flex items-baseline space-x-1">
                            <span className={`text-lg font-bold ${summary.color}`}>{summary.value}</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">{summary.unit}</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col items-end">
                    <div className="flex space-x-1 mb-1">
                        {!isReliable && <StatusBadge type="error" label="F" />}
                        {inAlarm && <StatusBadge type="error" label="A" animate />}
                    </div>
                    <ArrowRight size={14} className="text-slate-300 dark:text-slate-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
                </div>
            </div>
        );
    }

    return (
        <div 
            onClick={() => onClick(meter._internalId)}
            className={`
                relative rounded-xl border p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group
                ${inAlarm 
                    ? 'bg-white dark:bg-slate-800 border-red-200 dark:border-red-900/50 ring-1 ring-red-100 dark:ring-red-900/20' 
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500'}
            `}
        >
            <div className="flex justify-between items-start mb-3">
                <div className={`p-2.5 rounded-xl ${summary.bg} transition-transform group-hover:scale-110 duration-200`}>
                    {summary.icon}
                </div>
                
                <div className="flex flex-col items-end space-y-1">
                    {!isReliable && (
                        <StatusBadge type="error" label="FAULT" />
                    )}
                    {inAlarm && (
                        <StatusBadge type="error" label="ALARM" animate />
                    )}
                </div>
            </div>
            
            <div className="mb-1">
                <h3 className="text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wide truncate pr-2">
                    {meter._name}
                </h3>
            </div>

            <div className="flex items-baseline space-x-1 mb-4">
                <span className={`text-2xl font-bold ${summary.color}`}>{summary.value}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{summary.unit}</span>
            </div>
            
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate max-w-[120px]">
                    {summary.secondary}
                </span>
                <ArrowRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </div>
        </div>
    );
};

export const MeterSummaryCard = memo(MeterSummaryCardComponent);
