
import { IEC_FunctionalBlock_Common } from './base';
import { DPT_MeteringValue } from '../iec-types/dpt-metering-value';
import { DPT_Value_Volume_Flow, DPT_Value_Temp } from '../iec-types/dpt-float';
import { DPT_Tariff } from '../iec-types/dpt-tariff';
import { DPT_Value_1_Ucount } from '../iec-types/dpt-primitives';
import { DPT_DateTime } from '../iec-types/dpt-datetime';
import { GasMeasurementCondition, BreakerValveState } from '../iec-types/enums';

/**
 * IEC 63345:2023 Clause 7.5
 * MDC Gas Meter (M_GASM) - Table 6
 */
export interface M_GASM extends IEC_FunctionalBlock_Common {
    type: 'M_GASM';

    // Table 6 Data Points
    CurrentVolumeConsumption: DPT_MeteringValue;         // Accumulated gas volume
    CurrentVolumeFlow: DPT_Value_Volume_Flow;            // Current measured volume flow
    TempFlowGas?: DPT_Value_Temp;                        // Current flow temperature
    
    MeasurementCondition?: GasMeasurementCondition;      // DPT_Gas_Measurement_Condition
    ValveState?: BreakerValveState;                      // DPT_Meter_BreakerValve_State
    ReliabilityOfMeteringData: boolean;                  // DPT_Bool

    // History Common
    HistoryStorageNumbers?: DPT_Value_1_Ucount[];
    HistoryDate?: DPT_DateTime[];

    // History Specifics
    HistoryVolumeConsumption?: DPT_MeteringValue[];      // Array of volume consumption history values
    HistoryVolumeMaxFlow?: DPT_MeteringValue[];          // Array of max volume flow history values
    HistoryVolumeMinFlow?: DPT_MeteringValue[];          // Array of min volume flow history values

    // Tariffs (1 to 16)
    // "Accumulated active energy import value Tariff 1 to 16"
    CurrentEnergyConsumptionTariffs?: DPT_MeteringValue[];
    
    // History Tariffs (1 to 16)
    HistoryEnergyConsumptionTariffs?: DPT_MeteringValue[][];

    CurrentTariff?: DPT_Tariff;                          // Current tariff register value
    
    AveragingDuration?: number; // DPT_LongDeltaTimeSec
}
