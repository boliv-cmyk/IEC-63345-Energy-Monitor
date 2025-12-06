
import { M_GASM } from '../../functional-blocks/m-gasm';
import { MeteringDeviceType, GasMeasurementCondition, BreakerValveState } from '../../iec-types/enums';
import { generateCommonData, createFloat, createMeteringValue, generateDates, generateHistory } from './genCommon.ts';

export const generateGasMeter = (): M_GASM => {
    const common = generateCommonData('meter-gas-01', 'City Gas');
    const historyCount = 14;
    const historyDates = generateDates(historyCount);

    return {
        ...common,
        type: 'M_GASM',
        MeteringDeviceType: MeteringDeviceType.Gas,
        CurrentVolumeConsumption: createMeteringValue(12050, 'm3'),
        CurrentVolumeFlow: createFloat(1.2),
        TempFlowGas: createFloat(14.5),
        MeasurementCondition: GasMeasurementCondition.TemperatureConverted,
        ValveState: BreakerValveState.Closed,
        ReliabilityOfMeteringData: true,
        HistoryDate: historyDates,
        HistoryVolumeConsumption: generateHistory(2, 0.5, historyCount, 'm3')
    };
};
