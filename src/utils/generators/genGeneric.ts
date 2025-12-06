
import { M_GENERICM } from '../../functional-blocks/m-genericm';
import { MeteringDeviceType } from '../../iec-types/enums';
import { generateCommonData, createMeteringValue, generateDates, generateHistory } from './genCommon';

export const generateGenericMeter = (): M_GENERICM => {
    const common = generateCommonData('meter-oil-01', 'Oil Tank Level');
    const historyCount = 14;
    const historyDates = generateDates(historyCount);

    return {
        ...common,
        type: 'M_GENERICM',
        MeteringDeviceType: MeteringDeviceType.Oil,
        CurrentConsumption: createMeteringValue(1200, 'L'),
        ReliabilityOfMeteringData: true,
        HistoryDate: historyDates,
        HistoryConsumption: generateHistory(5, 2, historyCount, 'L')
    };
};
