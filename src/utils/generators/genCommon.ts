
import { DPT_DateTime } from '../../iec-types/dpt-datetime';
import { DPT_Float_F16 } from '../../iec-types/dpt-float';
import { DPT_MeteringValue } from '../../iec-types/dpt-metering-value';
import { BatteryStatus, MeterMode } from '../../iec-types/enums';

// --- Helper Functions ---

export const createDateTime = (date: Date): DPT_DateTime => ({
    year: date.getFullYear() - 1900,
    month: date.getMonth() + 1,
    dayOfMonth: date.getDate(),
    dayOfWeek: date.getDay() === 0 ? 7 : date.getDay(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
    fault: false,
    workingDay: true,
    noWD: false,
    noYear: false,
    noDate: false,
    noDayOfWeek: false,
    noTime: false,
    standardSummerTime: 0,
    qualityOfClock: 1
});

export const createFloat = (val: number): DPT_Float_F16 => ({
    rawValue: 0, // Mocked
    value: val
});

export const createMeteringValue = (val: number, unit: string, scalar: number = 1): DPT_MeteringValue => ({
    countVal: Math.round(val / scalar),
    valInfField: 0, // Mocked VIF
    value: val,
    unit: unit,
    scalar: scalar,
    status: {
        outOfService: false,
        fault: false,
        overridden: false,
        inAlarm: false,
        alarmUnAck: false
    }
});

export const generateDates = (count: number): DPT_DateTime[] => {
    const dates: DPT_DateTime[] = [];
    const now = new Date();
    for (let i = count - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        d.setHours(12, 0, 0, 0); // Normalize history time
        dates.push(createDateTime(d));
    }
    return dates;
};

export const generateHistory = (base: number, variance: number, count: number, unit: string, scalar: number = 1): DPT_MeteringValue[] => {
    return Array.from({ length: count }, () => {
        const val = Math.max(0, parseFloat((base + (Math.random() * variance - variance / 2)).toFixed(2)));
        return createMeteringValue(val, unit, scalar);
    });
};

export const generateCommonData = (id: string, name: string) => {
    const now = new Date();
    return {
        _internalId: id,
        _name: name,
        RxSequenceCounter: Math.floor(Math.random() * 255),
        RxReceptionTime: createDateTime(now),
        Manufacturer: 0x1234,
        VersionNumber: 1,
        DeviceStatus: 0,
        OperatingTime: 3600 * 24 * 365, // 1 year
        OnTime: 3600 * 24 * 360,
        CurrentDate: createDateTime(now),
        ReliabilityOfMeteringData: true,
        BatteryStatus: BatteryStatus.High,
        Mode: MeterMode.Normal
    };
};
