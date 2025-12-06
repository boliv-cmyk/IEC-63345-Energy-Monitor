
import { M_VALVEM } from '../../../functional-blocks/m-valve';
import { updateTime } from '../simulation-helpers';
import { BreakerValveState } from '../../../iec-types/enums';

export const tickValve = (meter: M_VALVEM): M_VALVEM => {
    const newTime = updateTime(meter.CurrentDate);
    
    // Valve Protection Function (VPF) Simulation
    // Occasionally cycle the valve to prevent sticking.
    // 0.1% chance to toggle state for simulation purposes.
    // Realistically this happens once a week, but we speed it up.
    
    let newState = meter.ValveState;
    const random = Math.random();

    if (random < 0.001) {
        // Toggle state
        newState = meter.ValveState === BreakerValveState.Closed 
            ? BreakerValveState.Open 
            : BreakerValveState.Closed;
    }

    return {
        ...meter,
        CurrentDate: newTime,
        ValveState: newState
    };
};
