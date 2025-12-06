
import { M_WATERM } from '../../functional-blocks/m-waterm';
import { MeteringDeviceType } from '../../iec-types/enums';
import { generateCommonData, createFloat, createMeteringValue, generateDates, generateHistory } from './genCommon';

export const generateWaterMeter = (): M_WATERM => {
    const common = generateCommonData('meter-water-01', 'Main Water Supply');
    const historyCount = 14;
    const historyDates = generateDates(historyCount);

    return {
        ...common,
        type: 'M_WATERM',
        MeteringDeviceType: MeteringDeviceType.Water,
        CurrentVolumeConsumption: createMeteringValue(3400.5, 'm3'),
        CurrentVolumeFlow: createFloat(0.05),
        TempFlowWater: createFloat(10.2),
        ReliabilityOfMeteringData: true,
        HistoryDate: historyDates,
        HistoryVolumeConsumption: generateHistory(0.4, 0.2, historyCount, 'm3')
    };
};
