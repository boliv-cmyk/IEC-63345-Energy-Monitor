
import { IEC_FunctionalBlock_Common } from './base';
import { DPT_MeteringValue } from '../iec-types/dpt-metering-value';
import { DPT_Value_Volume_Flow, DPT_Value_Temp } from '../iec-types/dpt-float';
import { DPT_Value_1_Ucount } from '../iec-types/dpt-primitives';
import { DPT_DateTime } from '../iec-types/dpt-datetime';

/**
 * IEC 63345:2023 Clause 7.3
 * MDC Water Meter (M_WATERM) - Table 4
 */
export interface M_WATERM extends IEC_FunctionalBlock_Common {
    type: 'M_WATERM';

    // Table 4 Data Points
    CurrentVolumeConsumption: DPT_MeteringValue;         // Accumulated water volume
    CurrentVolumeFlow: DPT_Value_Volume_Flow;            // Current measured volume flow
    TempFlowWater?: DPT_Value_Temp;                      // Current flow temperature
    
    ReliabilityOfMeteringData: boolean;                  // DPT_Bool

    // History
    HistoryStorageNumbers?: DPT_Value_1_Ucount[];
    HistoryDate?: DPT_DateTime[];
    
    HistoryVolumeConsumption?: DPT_MeteringValue[];      // Array of volume consumption history values
    HistoryVolumeMaxFlow?: DPT_MeteringValue[];          // Array of max. volume flow history values
    HistoryVolumeMinFlow?: DPT_MeteringValue[];          // Array of min. volume flow history values

    ErrorConsumption?: DPT_MeteringValue;
    AveragingDuration?: number;                          // DPT_LongDeltaTimeSec
}
