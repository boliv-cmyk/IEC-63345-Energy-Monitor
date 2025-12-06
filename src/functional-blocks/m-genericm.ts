
import { IEC_FunctionalBlock_Common } from './base';
import { DPT_MeteringValue } from '../iec-types/dpt-metering-value';
import { DPT_Value_1_Ucount } from '../iec-types/dpt-primitives';
import { DPT_DateTime } from '../iec-types/dpt-datetime';

/**
 * IEC 63345:2023 Clause 7.4
 * MDC Generic Meter (M_GENERICM) - Table 5
 * Used for Oil, Steam, etc.
 */
export interface M_GENERICM extends IEC_FunctionalBlock_Common {
    type: 'M_GENERICM';

    // Table 5 Data Points
    CurrentConsumption: DPT_MeteringValue;    // Accumulated metering value
    ReliabilityOfMeteringData: boolean;       // DPT_Bool

    // History
    HistoryStorageNumbers?: DPT_Value_1_Ucount[];
    HistoryDate?: DPT_DateTime[];
    HistoryConsumption?: DPT_MeteringValue[]; // Array of volume consumption history values

    ErrorConsumption?: DPT_MeteringValue;
    AveragingDuration?: number;               // DPT_LongDeltaTimeSec
}
