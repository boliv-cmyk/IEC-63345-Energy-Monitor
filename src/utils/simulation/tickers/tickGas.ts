
import { M_GASM } from '../../../functional-blocks/m-gasm';
import { updateTime, jitterFloat, incrementMeter } from '../simulation-helpers';

export const tickGas = (meter: M_GASM): M_GASM => {
    const newTime = updateTime(meter.CurrentDate);

    // Simulate Volume Flow fluctuation
    const newFlow = jitterFloat(meter.CurrentVolumeFlow, 0.1);
    
    // Accumulate Volume
    // Flow m3/h * (3/3600) h = m3
    const volInc = newFlow.value * (3/3600);
    
    return {
        ...meter,
        CurrentDate: newTime,
        CurrentVolumeFlow: newFlow,
        CurrentVolumeConsumption: incrementMeter(meter.CurrentVolumeConsumption, volInc)
    };
};
