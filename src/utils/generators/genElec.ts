
import { M_ELECM } from '../../functional-blocks/m-elecm';
import { MeteringDeviceType, BreakerValveState, PowerThresholdStatus } from '../../iec-types/enums';
import { generateCommonData, createFloat, createMeteringValue, generateDates, generateHistory } from './genCommon.ts';

export const generateElecMeter = (): M_ELECM => {
    const common = generateCommonData('meter-elec-01', 'Main Electricity');
    const historyCount = 14;
    const historyDates = generateDates(historyCount);

    return {
        ...common,
        type: 'M_ELECM',
        MeteringDeviceType: MeteringDeviceType.Electricity,
        CurrentEnergyConsumption: 12500500, // Wh
        CurrentEnergyProduction: 500, // Wh
        CurrentActivePowerConsumption: createFloat(4.25), // kW
        CurrentActivePowerProduction: createFloat(0),
        BreakerState: BreakerValveState.Closed,
        CurrentTariff: 1,
        PowerThresholdStatus: PowerThresholdStatus.Low,
        PowerThresholdValue: createMeteringValue(15, 'kW'),
        CurrentEnergyConsumptionTariffs: [
            createMeteringValue(8000000, 'Wh'), // T1
            createMeteringValue(4500500, 'Wh')  // T2
        ],
        HistoryDate: historyDates,
        HistoryEnergyConsumptionTariffs: [
            generateHistory(15, 5, historyCount, 'kWh') // Mocking daily history in kWh for display
        ]
    };
};
