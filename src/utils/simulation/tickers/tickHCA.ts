
import { M_HCA } from '../../../functional-blocks/m-hca';
import { updateTime, jitterFloat, incrementMeter } from '../simulation-helpers';

export const tickHCA = (meter: M_HCA): M_HCA => {
    const newTime = updateTime(meter.CurrentDate);

    // Simulate Temperatures
    // Radiator Temp ~55C (Heating season), Room ~21C
    const newFlowTemp = jitterFloat(meter.TempFlowWater || { rawValue: 0, value: 55 }, 0.5); 
    const newExtTemp = jitterFloat(meter.TempExternal || { rawValue: 0, value: 21 }, 0.2);
    
    // Calculate Delta T
    const deltaT = Math.max(0, newFlowTemp.value - newExtTemp.value);

    // HCA Counting Logic (Simplified)
    // Units accumulate proportional to DeltaT. 
    // If DeltaT < ~3-5K, usually no counting happens (Zero suppression).
    // Factor 0.01 is an arbitrary simulation constant for speed.
    let unitsInc = 0;
    if (deltaT > 5) {
        unitsInc = deltaT * 0.01; 
    }

    return {
        ...meter,
        CurrentDate: newTime,
        TempFlowWater: newFlowTemp,
        TempExternal: newExtTemp,
        CurrentEnergyConsumption: incrementMeter(meter.CurrentEnergyConsumption, unitsInc)
    };
};
