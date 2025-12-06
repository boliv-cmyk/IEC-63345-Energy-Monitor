
import { DPT_DateTime } from '../iec-types/dpt-datetime';
import { DPT_Float_F16 } from '../iec-types/dpt-float';
import { DPT_MeteringValue } from '../iec-types/dpt-metering-value';

/**
 * Checks if a value is defined and not null.
 */
export function isDefined<T>(val: T | undefined | null): val is T {
    return val !== undefined && val !== null;
}

/**
 * Checks if a DPT_DateTime represents a valid timestamp.
 * Returns false if critical validity flags (NoDate, NoTime) are set.
 */
export function isValidDateTime(dt: DPT_DateTime | undefined): boolean {
    if (!dt) return false;
    // IEC 63345 Table 24 Status Bits
    // ND (Bit 3) = No Date, NT (Bit 1) = No Time
    return !dt.noDate && !dt.noTime;
}

/**
 * Checks if a DPT_Float_F16 contains a valid numeric value.
 * Handles the 0x7FFF (Invalid) special case from Table 12.
 */
export function isValidFloat(fl: DPT_Float_F16 | undefined): boolean {
    if (!fl) return false;
    return fl.rawValue !== 0x7FFF && !isNaN(fl.value);
}

/**
 * Checks if a DPT_MeteringValue is valid and in service.
 */
export function isValidMeteringValue(mv: DPT_MeteringValue | undefined): boolean {
    if (!mv) return false;
    return !mv.status.outOfService && !mv.status.fault;
}
