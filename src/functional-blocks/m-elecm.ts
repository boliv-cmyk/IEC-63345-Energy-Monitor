
import { IEC_FunctionalBlock_Common } from './base';
import { DPT_ActiveEnergy } from '../iec-types/dpt-active-energy';
import { DPT_MeteringValue } from '../iec-types/dpt-metering-value';
import { DPT_Power } from '../iec-types/dpt-float';
import { DPT_Tariff } from '../iec-types/dpt-tariff';
import { DPT_Value_1_Ucount } from '../iec-types/dpt-primitives';
import { DPT_DateTime } from '../iec-types/dpt-datetime';
import { BreakerValveState, PowerThresholdStatus } from '../iec-types/enums';

/**
 * IEC 63345:2023 Clause 7.6
 * MDC Electricity Meter (M_ELECM) - Table 7
 */
export interface M_ELECM extends IEC_FunctionalBlock_Common {
    type: 'M_ELECM';

    // Table 7 Data Points
    CurrentEnergyConsumption: DPT_ActiveEnergy;          // Accumulated active energy import value
    CurrentEnergyProduction: DPT_ActiveEnergy;           // Accumulated active energy export value
    CurrentReactiveEnergy?: DPT_MeteringValue;           // Current reactive energy
    
    BreakerState?: BreakerValveState;                    // DPT_Meter_BreakerValve_State
    ReliabilityOfMeteringData: boolean;                  // DPT_Bool

    // Tariffs (1 to 16) - Import
    // Represented as array. Index 0 corresponds to Tariff 1.
    CurrentEnergyConsumptionTariffs?: DPT_MeteringValue[]; 

    // Tariffs (1 to 16) - Export
    CurrentEnergyProductionTariffs?: DPT_MeteringValue[];

    // History (1 to 16)
    // Note: The standard says "HistoryEnergyConsumptionTariff1 to f16".
    // We map this to arrays of historical values.
    HistoryEnergyConsumptionTariffs?: DPT_MeteringValue[][]; // Array of arrays? Or parallel arrays?
    // Clarification: The standard lists "HistoryEnergyConsumptionTariff1" as "Array of energy consumption history values".
    // So for each tariff, there is an array of history values.
    HistoryEnergyProductionTariffs?: DPT_MeteringValue[][];

    CurrentActivePowerConsumption: DPT_Power;            // Current measured power consumption
    CurrentActivePowerProduction?: DPT_Power;            // Current measured power production
    
    CurrentTariff?: DPT_Tariff;                          // Current tariff register value
    
    PowerThresholdStatus?: PowerThresholdStatus;         // DPT_Power_Threshold_Status
    PowerThresholdValue?: DPT_MeteringValue;             // Value of the current power threshold
    
    // Arrays corresponding to history depth
    HistoryStorageNumbers?: DPT_Value_1_Ucount[];        // Array of storage numbers
    HistoryDate?: DPT_DateTime[];                        // Array of date/time information
    
    AveragingDuration?: number; // DPT_LongDeltaTimeSec (via Common, but listed specifically in Table 7)
}
