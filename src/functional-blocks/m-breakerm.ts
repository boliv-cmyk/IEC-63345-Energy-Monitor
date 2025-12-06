
import { IEC_FunctionalBlock_Common } from './base';
import { BreakerValveState } from '../iec-types/enums';

/**
 * IEC 63345:2023 Clause 7.7
 * MDC Breaker (M_BREAKERM) - Table 8
 */
export interface M_BREAKERM extends IEC_FunctionalBlock_Common {
    type: 'M_BREAKERM';

    // Table 8 Data Points
    BreakerState: BreakerValveState;    // DPT_Meter_BreakerValve_State
    ReliabilityOfMeteringData: boolean; // DPT_Bool
}
