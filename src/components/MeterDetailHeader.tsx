
import React from 'react';
import { IEC_Meter } from '../context/MDCContext';
import { Tag, Clock } from 'lucide-react';
import { DPTRenderer_DateTime } from './dpt-renderers/DPTRenderer_DateTime';
import { AlarmBanner } from './AlarmBanner';
import { useMeterStatus } from '../hooks/useMeterStatus';
import { BatteryStatus } from '../iec-types/enums';
import { Tooltip } from './ui/Tooltip';
import { StatusBadge } from './ui/StatusBadge';

interface Props {
    meter: IEC_Meter;
}

export const MeterDetailHeader: React.FC<Props> = ({ meter }) => {
    const { 
        inAlarm, 
        alarmUnAck, 
        isReliable, 
        hasDeviceStatusIssue, 
        healthColor, 
        healthBg,
        darkHealthColor, 
        darkHealthBg 
    } = useMeterStatus(meter);

    const getBatteryType = (status?: BatteryStatus) => {
        switch (status) {
            case BatteryStatus.High: return 'success';
            case BatteryStatus.Medium: return 'warning';
            case BatteryStatus.Low: return 'error';
            default: return 'neutral';
        }
    };

    const getBatteryText = (status?: BatteryStatus) => {
        switch (status) {
            case BatteryStatus.High: return "Batt: OK";
            case BatteryStatus.Medium: return "Batt: Med";
            case BatteryStatus.Low: return "Batt: Low";
            default: return "Batt: --";
        }
    };

    return (
        <div className="flex flex-col space-y-4 mb-6">
            <AlarmBanner 
                inAlarm={inAlarm} 
                alarmUnAck={alarmUnAck} 
                deviceStatus={meter.DeviceStatus || 0} 
                meterId={meter._internalId}
            />
            
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden gap-4 transition-colors">
                {/* Reliability Overlay Stripe */}
                {!isReliable && (
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500 animate-pulse"></div>
                )}

                <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg flex-shrink-0 ${healthBg} ${darkHealthBg} ${healthColor} ${darkHealthColor}`}>
                        <Tag size={28} />
                    </div>
                    <div>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-1">
                            <span className="font-mono bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-xs border border-slate-200 dark:border-slate-600">
                                ID: {meter._internalId}
                            </span>
                            <span className="hidden sm:inline opacity-50">•</span>
                            <span className="font-semibold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700/50 px-2 py-0.5 rounded text-xs">
                                {meter.type}
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{meter._name}</h1>
                    </div>
                </div>
                
                <div className="w-full lg:w-auto flex flex-col items-start lg:items-end space-y-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-700">
                    <div className="flex items-center space-x-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-600">
                        <Clock size={14} className="text-slate-400 dark:text-slate-500" />
                        <span className="text-slate-400 dark:text-slate-500 text-xs uppercase tracking-wide">Last Update:</span>
                        <div className="font-mono text-xs text-slate-700 dark:text-slate-200">
                            <DPTRenderer_DateTime value={meter.CurrentDate} compact />
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                        {/* Battery Indicator */}
                        {meter.BatteryStatus !== undefined && (
                            <Tooltip content={`IEC 63345 Battery Status: ${BatteryStatus[meter.BatteryStatus]}`}>
                                <StatusBadge 
                                    type={getBatteryType(meter.BatteryStatus)} 
                                    label={getBatteryText(meter.BatteryStatus)} 
                                />
                            </Tooltip>
                        )}

                        {hasDeviceStatusIssue ? (
                            <StatusBadge 
                                type="error" 
                                label={`Status: 0x${(meter.DeviceStatus || 0).toString(16).toUpperCase()}`} 
                            />
                        ) : (
                            <StatusBadge type="success" label="Device OK" />
                        )}
                        
                        {!isReliable && (
                            <StatusBadge type="error" label="DATA FAULT" animate />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
