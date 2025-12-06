
import { M_WATERM } from '../../../functional-blocks/m-waterm';
import { updateTime, jitterFloat, incrementMeter } from '../simulation-helpers';

export const tickWater = (meter: M_WATERM): M_WATERM => {
    // Update common clock
    const newTime = updateTime(meter.CurrentDate);

    // Simulate Flow fluctuation (jitter 0.05 m3/h)
    const newFlow = jitterFloat(meter.CurrentVolumeFlow, 0.05);
    
    // Accumulate Volume
    // Flow m3/h * (3/3600) h = m3 (Assuming ~3s tick)
    // NOTE: In a real simulation, we should use the actual time delta between ticks.
    // For this mock, we assume a constant interval.
    const volInc = newFlow.value * (3/3600);
    
    return {
        ...meter,
        CurrentDate: newTime,
        CurrentVolumeFlow: newFlow,
        CurrentVolumeConsumption: incrementMeter(meter.CurrentVolumeConsumption, volInc)
    };
};
