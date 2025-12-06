
import { M_ELECM } from '../../../functional-blocks/m-elecm';
import { updateTime, jitterFloat, incrementMeter } from '../simulation-helpers';
import { PowerThresholdStatus } from '../../../iec-types/enums';

export const tickElec = (meter: M_ELECM): M_ELECM => {
    // Update common time
    const newTime = updateTime(meter.CurrentDate);

    // Simulate Active Power fluctuation (jitter by 0.5 kW)
    // Occasional spikes to test threshold logic
    const spike = Math.random() < 0.05 ? 10 : 0; 
    const newPower = jitterFloat(meter.CurrentActivePowerConsumption, 0.5 + spike);
    
    // Accumulate Energy based on power
    // Time delta assumed ~3 seconds. Power kW * (3/3600) h = kWh
    // Convert to Wh for accumulation
    const energyIncWh = (newPower.value * (3/3600)) * 1000; 

    // Threshold Logic (IEC 63345 Table 31)
    let newThresholdStatus = meter.PowerThresholdStatus;
    
    if (meter.PowerThresholdValue) {
        // PowerThresholdValue is DPT_MeteringValue. 
        // We assume units match (kW vs kW) for this simulation simplifiction.
        const threshold = meter.PowerThresholdValue.value;
        const current = newPower.value;

        if (current > threshold) {
            newThresholdStatus = PowerThresholdStatus.High;
        } else if (current > (threshold * 0.8)) {
            newThresholdStatus = PowerThresholdStatus.Medium;
        } else {
            newThresholdStatus = PowerThresholdStatus.Low;
        }
    }
    
    return {
        ...meter,
        CurrentDate: newTime,
        CurrentActivePowerConsumption: newPower,
        PowerThresholdStatus: newThresholdStatus,
        CurrentEnergyConsumption: meter.CurrentEnergyConsumption + energyIncWh,
        // Update Tariff 1 as well if it exists
        CurrentEnergyConsumptionTariffs: meter.CurrentEnergyConsumptionTariffs?.map((t, i) => 
            i === 0 ? incrementMeter(t, energyIncWh) : t
        )
    };
};
