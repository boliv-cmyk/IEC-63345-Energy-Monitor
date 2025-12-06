
import { M_BREAKERM } from '../../../functional-blocks/m-breakerm';
import { updateTime } from '../simulation-helpers';
import { BreakerValveState } from '../../../iec-types/enums';

export const tickBreaker = (meter: M_BREAKERM): M_BREAKERM => {
    const newTime = updateTime(meter.CurrentDate);
    
    // Simulate Random Trip (Overload Protection)
    // Very low probability event: 0.05% chance per tick
    let newState = meter.BreakerState;
    
    if (meter.BreakerState === BreakerValveState.Closed) {
        if (Math.random() < 0.0005) {
            newState = BreakerValveState.Open;
            // Ideally we would also set a "Trip" flag or Event Log here, 
            // but the pure ticker function just transforms state.
            // The Context wrapper could detect the change and log it.
        }
    }

    return {
        ...meter,
        CurrentDate: newTime,
        BreakerState: newState
    };
};
