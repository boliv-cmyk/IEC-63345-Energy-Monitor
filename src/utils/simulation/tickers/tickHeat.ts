
import { M_HEATM } from '../../../functional-blocks/m-heatm';
import { updateTime, jitterFloat, incrementMeter } from '../simulation-helpers';

export const tickHeat = (meter: M_HEATM): M_HEATM => {
    const newTime = updateTime(meter.CurrentDate);

    // Morning Warm-up Logic (06:00 - 09:00)
    // In a real device this follows the clock. Here we use the simulated meter clock.
    const hour = newTime.hour;
    const isMorningPeak = hour >= 6 && hour < 9;

    // Simulate Temperatures
    // Flow ~75C (higher in morning), Return ~45C
    const baseFlow = isMorningPeak ? 82.0 : 75.0;
    const baseReturn = isMorningPeak ? 50.0 : 45.0;

    const newFlowTemp = jitterFloat({ ...meter.TempFlowWater, value: baseFlow }, 0.5); 
    const newReturnTemp = jitterFloat({ ...meter.TempReturnWater, value: baseReturn }, 0.3);
    
    // Calculate Delta manually to keep consistency
    const diffVal = Math.max(0, newFlowTemp.value - newReturnTemp.value);
    const newDiffTemp = { ...meter.TempDiffWater, value: diffVal };

    // Simulate Volume Flow
    // Higher flow in morning
    const baseFlowRate = isMorningPeak ? 1.5 : 0.8;
    const currentFlowVal = meter.CurrentVolumeFlow.value;
    // Smooth transition towards base
    const targetFlow = baseFlowRate + (Math.random() - 0.5) * 0.2;
    const newFlowVal = currentFlowVal + (targetFlow - currentFlowVal) * 0.1; // Smooth approach
    
    // Calculate Instantaneous Power (simplified physics: P = Q * dt * k)
    // k ~ 1.16 kWh/m3K. 
    // Power (kW) = Flow (m3/h) * DeltaT (K) * 1.16
    const calculatedPower = newFlowVal * diffVal * 1.16;

    // Energy Increment
    // Power kW * (3/3600) h = kWh
    const energyInc = calculatedPower * (3/3600);

    return {
        ...meter,
        CurrentDate: newTime,
        TempFlowWater: newFlowTemp,
        TempReturnWater: newReturnTemp,
        TempDiffWater: newDiffTemp,
        CurrentVolumeFlow: {
            ...meter.CurrentVolumeFlow,
            value: newFlowVal,
            countVal: Math.round(newFlowVal / meter.CurrentVolumeFlow.scalar)
        },
        CurrentPower: {
            ...meter.CurrentPower,
            value: calculatedPower,
            countVal: Math.round(calculatedPower / meter.CurrentPower.scalar)
        },
        CurrentEnergyConsumption: incrementMeter(meter.CurrentEnergyConsumption, energyInc)
    };
};
