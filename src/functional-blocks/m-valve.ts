
import { IEC_FunctionalBlock_Common } from './base';
import { BreakerValveState } from '../iec-types/enums';

/**
 * IEC 63345:2023 Clause 7.8
 * MDC Valve (M_VALVEM) - Table 9
 */
export interface M_VALVEM extends IEC_FunctionalBlock_Common {
    type: 'M_VALVEM';

    // Table 9 Data Points
    ValveState: BreakerValveState;      // DPT_Meter_BreakerValve_State
    ReliabilityOfMeteringData: boolean; // DPT_Bool
}
