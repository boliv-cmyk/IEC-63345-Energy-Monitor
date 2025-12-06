
import { IEC_FunctionalBlock_Common } from './base';
import { DPT_MeteringValue } from '../iec-types/dpt-metering-value';
import { DPT_Value_Temp } from '../iec-types/dpt-float';
import { DPT_Value_1_Ucount } from '../iec-types/dpt-primitives';
import { DPT_DateTime } from '../iec-types/dpt-datetime';

/**
 * IEC 63345:2023 Clause 7.2
 * MDC Heat Cost Allocator (M_HCA) - Table 3
 */
export interface M_HCA extends IEC_FunctionalBlock_Common {
    type: 'M_HCA';

    // Table 3 Data Points
    CurrentEnergyConsumption: DPT_MeteringValue;         // Accumulated HCA units
    TempFlowWater?: DPT_Value_Temp;                      // Flow temperature (radiator temperature)
    TempExternal?: DPT_Value_Temp;                       // External temperature (room temperature)
    
    ReliabilityOfMeteringData: boolean;                  // DPT_Bool

    // History
    HistoryStorageNumbers?: DPT_Value_1_Ucount[];
    HistoryDate?: DPT_DateTime[];
    HistoryEnergyConsumption?: DPT_MeteringValue[];      // Array of energy consumption history values
}
