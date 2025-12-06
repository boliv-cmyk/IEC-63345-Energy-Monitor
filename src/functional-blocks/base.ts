
import { DPT_Value_1_Ucount, DPT_Value_2_Ucount, DPT_Value_4_Ucount, DPT_LongDeltaTimeSec } from '../iec-types/dpt-primitives';
import { DPT_DateTime } from '../iec-types/dpt-datetime';
import { MeteringDeviceType, MeterMode, BatteryStatus, BreakerValveState } from '../iec-types/enums';
import { DPT_Currency } from '../iec-types/dpt-currency';
import { DPT_Cost, DPT_Credit } from '../iec-types/dpt-price';
import { DPT_Tariff } from '../iec-types/dpt-tariff';

/**
 * IEC 63345:2023
 * Common Data Interface for Metering Functional Blocks
 * 
 * Aggregates common fields found in Tables 2 through 9.
 */
export interface IEC_FunctionalBlock_Common {
    // Internal identifiers for the App (not in standard)
    _internalId: string;
    _name: string;

    // --- Standard Data Points ---

    // Synchronization
    RxSequenceCounter?: DPT_Value_1_Ucount;
    RxReceptionTime?: DPT_DateTime;

    // Identity
    Manufacturer?: DPT_Value_2_Ucount;
    IdentificationNumber?: DPT_Value_4_Ucount; // 8 digit BCD -> mapped to number
    VersionNumber?: DPT_Value_1_Ucount;
    MeteringDeviceType: MeteringDeviceType;
    FabricationNumber?: DPT_Value_4_Ucount;
    AccessNumber?: DPT_Value_1_Ucount;

    // Status & Time
    DeviceStatus?: DPT_Value_1_Ucount; // Bitset
    OperatingTime?: DPT_LongDeltaTimeSec;
    OnTime?: DPT_LongDeltaTimeSec;
    CurrentDate?: DPT_DateTime;
    ErrorDate?: DPT_DateTime;

    // Data
    MeteringRawData?: DPT_Value_1_Ucount[]; // Raw telegram bytes
    UserText?: string; // DPT_VarString_8859_1

    // Lifecycle
    MeterReplacement?: boolean; // DPT_Bool
    MeterReplacementCounter?: DPT_Value_1_Ucount;

    // Financials
    Currency?: DPT_Currency;
    AccumulatedCost?: DPT_Cost;
    CurrentCredit?: DPT_Credit;

    // State
    Mode?: MeterMode;
    BatteryStatus?: BatteryStatus;
    
    // Note: Some common fields might be missing from specific tables 
    // (e.g. Breaker might not have AccumulatedCost), 
    // but they are listed in the general Data Model section often.
    // We treat them as optional.
}
