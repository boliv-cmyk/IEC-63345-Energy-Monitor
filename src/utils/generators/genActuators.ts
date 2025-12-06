
import { M_BREAKERM } from '../../functional-blocks/m-breakerm';
import { M_VALVEM } from '../../functional-blocks/m-valve';
import { MeteringDeviceType, BreakerValveState } from '../../iec-types/enums';
import { generateCommonData } from './genCommon';

export const generateBreaker = (): M_BREAKERM => {
    const common = generateCommonData('dev-breaker-01', 'Main Circuit Breaker');
    return {
        ...common,
        type: 'M_BREAKERM',
        MeteringDeviceType: MeteringDeviceType.Breaker,
        BreakerState: BreakerValveState.Closed,
        ReliabilityOfMeteringData: true
    };
};

export const generateValve = (): M_VALVEM => {
    const common = generateCommonData('dev-valve-01', 'Emergency Gas Valve');
    return {
        ...common,
        type: 'M_VALVEM',
        MeteringDeviceType: MeteringDeviceType.Valve,
        ValveState: BreakerValveState.Closed,
        ReliabilityOfMeteringData: true
    };
};
