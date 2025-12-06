
import { M_HCA } from '../../functional-blocks/m-hca';
import { MeteringDeviceType } from '../../iec-types/enums';
import { generateCommonData, createFloat, createMeteringValue, generateDates, generateHistory } from './genCommon';

export const generateHCAMeter = (): M_HCA => {
    const common = generateCommonData('meter-hca-01', 'Living Room HCA');
    const historyCount = 14;
    const historyDates = generateDates(historyCount);

    return {
        ...common,
        type: 'M_HCA',
        MeteringDeviceType: MeteringDeviceType.HeatCostAllocator,
        CurrentEnergyConsumption: createMeteringValue(850, 'HCA'),
        TempFlowWater: createFloat(55),
        TempExternal: createFloat(21),
        ReliabilityOfMeteringData: true,
        HistoryDate: historyDates,
        HistoryEnergyConsumption: generateHistory(2, 1, historyCount, 'units')
    };
};
