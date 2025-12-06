
import { useMemo } from 'react';
import { IEC_Meter } from '../context/MDCContext';
import { 
    isMeterInAlarm, 
    isAlarmUnacknowledged, 
    isSupplyInterrupted, 
    getMeterHealthColor, 
    getMeterHealthBg 
} from '../utils/status-helpers';

export interface MeterStatusResult {
    inAlarm: boolean;
    alarmUnAck: boolean;
    isReliable: boolean;
    isInterrupted: boolean;
    hasDeviceStatusIssue: boolean;
    healthColor: string;
    healthBg: string;
    darkHealthColor: string;
    darkHealthBg: string;
}

export const useMeterStatus = (meter: IEC_Meter): MeterStatusResult => {
    return useMemo(() => {
        const inAlarm = isMeterInAlarm(meter);
        const alarmUnAck = isAlarmUnacknowledged(meter);
        const isReliable = meter.ReliabilityOfMeteringData;
        const isInterrupted = isSupplyInterrupted(meter);
        const hasDeviceStatusIssue = (meter.DeviceStatus || 0) !== 0;
        
        const healthColor = getMeterHealthColor(meter);
        const healthBg = getMeterHealthBg(meter);

        // Derive dark mode variants based on standard mapping
        // This keeps logic centralized instead of scattered in components
        const getDarkColor = (col: string) => {
            if (col.includes('red')) return 'dark:text-red-400';
            if (col.includes('rose')) return 'dark:text-rose-400';
            if (col.includes('amber')) return 'dark:text-amber-400';
            if (col.includes('yellow')) return 'dark:text-yellow-400';
            return 'dark:text-emerald-400';
        };

        const getDarkBg = (bg: string) => {
            if (bg.includes('red')) return 'dark:bg-red-900/30';
            if (bg.includes('rose')) return 'dark:bg-rose-900/30';
            if (bg.includes('amber')) return 'dark:bg-amber-900/30';
            if (bg.includes('yellow')) return 'dark:bg-yellow-900/30';
            return 'dark:bg-emerald-900/30';
        };

        return {
            inAlarm,
            alarmUnAck,
            isReliable,
            isInterrupted,
            hasDeviceStatusIssue,
            healthColor,
            healthBg,
            darkHealthColor: getDarkColor(healthColor),
            darkHealthBg: getDarkBg(healthBg)
        };
    }, [meter]);
};
