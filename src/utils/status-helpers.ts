
import { IEC_Meter } from '../context/MDCContext';
import { M_GASM } from '../functional-blocks/m-gasm';
import { M_HEATM } from '../functional-blocks/m-heatm';
import { M_WATERM } from '../functional-blocks/m-waterm';
import { M_HCA } from '../functional-blocks/m-hca';
import { M_GENERICM } from '../functional-blocks/m-genericm';
import { BreakerValveState } from '../iec-types/enums';

/**
 * Helper to check if a meter has specific alarm flags set.
 * Checks specific DPT_MeteringValue status bits based on meter type,
 * or falls back to DeviceStatus bit 0.
 */
export const isMeterInAlarm = (meter: IEC_Meter): boolean => {
    // Check specific primary values first
    switch (meter.type) {
        case 'M_GASM':
            return (meter as M_GASM).CurrentVolumeConsumption.status.inAlarm;
        case 'M_HEATM':
            return (meter as M_HEATM).CurrentEnergyConsumption.status.inAlarm;
        case 'M_WATERM':
            return (meter as M_WATERM).CurrentVolumeConsumption.status.inAlarm;
        case 'M_HCA':
            return (meter as M_HCA).CurrentEnergyConsumption.status.inAlarm;
        case 'M_GENERICM':
            return (meter as M_GENERICM).CurrentConsumption.status.inAlarm;
        default:
            // For ELECM, BREAKER, VALVE: Check DeviceStatus Bit 0 (General Alarm)
            // This is a simulation assumption as Table 7 ActiveEnergy is a primitive V32
            return ((meter.DeviceStatus || 0) & 0x01) === 1;
    }
};

/**
 * Checks for unacknowledged alarms.
 */
export const isAlarmUnacknowledged = (meter: IEC_Meter): boolean => {
    switch (meter.type) {
        case 'M_GASM':
            return (meter as M_GASM).CurrentVolumeConsumption.status.alarmUnAck;
        case 'M_HEATM':
            return (meter as M_HEATM).CurrentEnergyConsumption.status.alarmUnAck;
        case 'M_WATERM':
            return (meter as M_WATERM).CurrentVolumeConsumption.status.alarmUnAck;
        case 'M_HCA':
            return (meter as M_HCA).CurrentEnergyConsumption.status.alarmUnAck;
        case 'M_GENERICM':
            return (meter as M_GENERICM).CurrentConsumption.status.alarmUnAck;
        default:
            return false;
    }
};

/**
 * Returns true if the critical functional state is "Open" (Interrupted)
 * for Valves or Breakers.
 */
export const isSupplyInterrupted = (meter: IEC_Meter): boolean => {
    if (meter.type === 'M_BREAKERM') {
        return meter.BreakerState === BreakerValveState.Open;
    }
    if (meter.type === 'M_VALVEM') {
        return meter.ValveState === BreakerValveState.Open; // Open = Interrupted in IEC 63345
    }
    if (meter.type === 'M_GASM') {
        return meter.ValveState === BreakerValveState.Open;
    }
    if (meter.type === 'M_ELECM') {
        return meter.BreakerState === BreakerValveState.Open;
    }
    return false;
};

/**
 * Returns a color class for the meter's overall health status.
 */
export const getMeterHealthColor = (meter: IEC_Meter): string => {
    if (!meter.ReliabilityOfMeteringData) return 'text-red-600';
    if (isMeterInAlarm(meter)) return 'text-rose-600';
    if (isSupplyInterrupted(meter)) return 'text-amber-600';
    if ((meter.DeviceStatus || 0) !== 0) return 'text-yellow-600';
    return 'text-emerald-600';
};

export const getMeterHealthBg = (meter: IEC_Meter): string => {
    if (!meter.ReliabilityOfMeteringData) return 'bg-red-50';
    if (isMeterInAlarm(meter)) return 'bg-rose-50';
    if (isSupplyInterrupted(meter)) return 'bg-amber-50';
    if ((meter.DeviceStatus || 0) !== 0) return 'bg-yellow-50';
    return 'bg-emerald-50';
};
