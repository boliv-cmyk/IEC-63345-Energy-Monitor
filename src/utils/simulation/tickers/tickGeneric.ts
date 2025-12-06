
import { M_GENERICM } from '../../../functional-blocks/m-genericm';
import { updateTime, incrementMeter } from '../simulation-helpers';
import { MeteringDeviceType } from '../../../iec-types/enums';

export const tickGeneric = (meter: M_GENERICM): M_GENERICM => {
    const newTime = updateTime(meter.CurrentDate);

    // Simulate generic increment based on device type
    let increment = 0;

    switch(meter.MeteringDeviceType) {
        case MeteringDeviceType.Oil:
            // Oil consumption is usually slower. 
            // Simulate 0.1L increment every ~3-5 ticks on average
            if (Math.random() < 0.3) {
                increment = 0.1;
            }
            break;
        case MeteringDeviceType.Steam:
            // Steam kg/h. High consumption.
            // 0.5kg per tick
            increment = 0.5;
            break;
        case MeteringDeviceType.WarmWater:
            // Warm Water m3. Variable consumption.
            if (Math.random() < 0.4) {
                increment = 0.05;
            }
            break;
        case MeteringDeviceType.WasteWater:
            // Waste Water m3. Spikey consumption.
            if (Math.random() < 0.2) {
                increment = 0.1;
            }
            break;
        default:
            // Generic/Other
            if (Math.random() < 0.3) {
                increment = 0.2;
            }
            break;
    }

    return {
        ...meter,
        CurrentDate: newTime,
        CurrentConsumption: incrementMeter(meter.CurrentConsumption, increment)
    };
};
