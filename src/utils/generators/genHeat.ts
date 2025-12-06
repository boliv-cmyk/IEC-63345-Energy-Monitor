
import { M_HEATM } from '../../functional-blocks/m-heatm';
import { MeteringDeviceType } from '../../iec-types/enums';
import { generateCommonData, createFloat, createMeteringValue, generateDates, generateHistory } from './genCommon.ts';

export const generateHeatMeter = (): M_HEATM => {
    const common = generateCommonData('meter-heat-01', 'District Heating');
    const historyCount = 14;
    const historyDates = generateDates(historyCount);

    return {
        ...common,
        type: 'M_HEATM',
        MeteringDeviceType: MeteringDeviceType.Heat,
        CurrentEnergyConsumption: createMeteringValue(4500, 'kWh'),
        TempFlowWater: createFloat(75.5),
        TempReturnWater: createFloat(45.2),
        TempDiffWater: createFloat(30.3),
        CurrentPower: createMeteringValue(3.5, 'kW'),
        CurrentVolumeFlow: createMeteringValue(0.8, 'm3/h'),
        ReliabilityOfMeteringData: true,
        
        // Min/Max Records (Current)
        MaxPower: createMeteringValue(5.2, 'kW'),
        MinPower: createMeteringValue(1.1, 'kW'),
        MaxPowerDate: historyDates[historyDates.length - 1], // Last date
        MinPowerDate: historyDates[0],

        HistoryDate: historyDates,
        
        // Table 2 History Arrays
        HistoryEnergyConsumption: generateHistory(40, 10, historyCount, 'kWh'),
        
        // Power History
        HistoryMaxPower: generateHistory(6, 1.5, historyCount, 'kW'),
        HistoryMinPower: generateHistory(1.5, 0.5, historyCount, 'kW'),
        
        // Flow History
        HistoryVolumeMaxFlow: generateHistory(1.2, 0.3, historyCount, 'm3/h'),
        HistoryVolumeMinFlow: generateHistory(0.1, 0.05, historyCount, 'm3/h')
    };
};
