
import { DPT_DateTime } from '../../iec-types/dpt-datetime';
import { DPT_MeteringValue } from '../../iec-types/dpt-metering-value';
import { DPT_Float_F16 } from '../../iec-types/dpt-float';

// Helper to update DateTime
export const updateTime = (dt?: DPT_DateTime): DPT_DateTime => {
    const now = new Date();
    return {
        year: now.getFullYear() - 1900,
        month: now.getMonth() + 1,
        dayOfMonth: now.getDate(),
        dayOfWeek: now.getDay() || 7,
        hour: now.getHours(),
        minute: now.getMinutes(),
        second: now.getSeconds(),
        fault: false,
        workingDay: dt?.workingDay ?? true,
        noWD: false,
        noYear: false,
        noDate: false,
        noDayOfWeek: false,
        noTime: false,
        standardSummerTime: dt?.standardSummerTime ?? 0,
        qualityOfClock: 1
    };
};

// Helper to jitter a float value
export const jitterFloat = (float: DPT_Float_F16, variance: number): DPT_Float_F16 => {
    const change = (Math.random() - 0.5) * variance;
    const newVal = Math.max(0, float.value + change);
    return { ...float, value: newVal };
};

// Helper to increment a metering value
export const incrementMeter = (mv: DPT_MeteringValue, increment: number): DPT_MeteringValue => {
    const newVal = mv.value + increment;
    return {
        ...mv,
        value: newVal,
        countVal: Math.round(newVal / mv.scalar)
    };
};
