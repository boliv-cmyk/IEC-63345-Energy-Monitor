
import { IEC_FunctionalBlock_Common } from './base';
import { DPT_MeteringValue } from '../iec-types/dpt-metering-value';
import { DPT_Value_Temp, DPT_Value_Tempd } from '../iec-types/dpt-float';
import { DPT_Value_1_Ucount } from '../iec-types/dpt-primitives';
import { DPT_DateTime } from '../iec-types/dpt-datetime';

/**
 * IEC 63345:2023 Clause 7.1
 * MDC Heat Meter (M_HEATM) - Table 2
 */
export interface M_HEATM extends IEC_FunctionalBlock_Common {
    type: 'M_HEATM';

    // Table 2 Data Points
    CurrentEnergyConsumption: DPT_MeteringValue;         // Accumulated energy value
    TempFlowWater: DPT_Value_Temp;                       // Current flow temperature
    TempReturnWater: DPT_Value_Temp;                     // Current return temperature
    TempDiffWater: DPT_Value_Tempd;                      // Current temperature difference
    
    ReliabilityOfMeteringData: boolean;                  // DPT_Bool
    
    CurrentPower: DPT_MeteringValue;                     // Current measured power (Note: Table 2 uses DPT_MeteringValue, not DPT_Power)
    CurrentVolumeFlow: DPT_MeteringValue;                // Current measured volume flow
    
    CurrentEnergyConsumption_T1?: DPT_MeteringValue;     // Current energy consumption Tarif 1
    
    // History Arrays
    HistoryStorageNumbers?: DPT_Value_1_Ucount[];
    HistoryDate?: DPT_DateTime[];
    
    HistoryEnergyConsumption?: DPT_MeteringValue[];      // Array of energy consumption history values
    HistoryEnergyConsumption_T1?: DPT_MeteringValue[];   // Array of energy consumption tarif 1 history values
    
    HistoryVolumeMaxFlow?: DPT_MeteringValue[];
    HistoryVolumeMinFlow?: DPT_MeteringValue[];
    HistoryMaxPower?: DPT_MeteringValue[];
    HistoryMinPower?: DPT_MeteringValue[];
    
    // Min/Max Records
    MaxPowerDate?: DPT_DateTime;
    MaxPower?: DPT_MeteringValue;
    MinPowerDate?: DPT_DateTime;
    MinPower?: DPT_MeteringValue;
    
    ErrorConsumption?: DPT_MeteringValue;                // Value of energy consumption at the moment when an error occurred
    AveragingDuration?: number;                          // DPT_LongDeltaTimeSec
}
