import { 
    MeterData, 
    M_ELECM, 
    M_GASM, 
    M_HEATM, 
    M_WATERM, 
    M_HCA,
    M_BREAKERM,
    M_VALVEM,
    MeteringDeviceType,
    BreakerValveState,
    BatteryStatus,
    MeterMode,
    PowerThresholdStatus,
    GasMeasurementCondition
} from '../types';

const generateHistory = (base: number, variance: number, count: number): number[] => {
    return Array.from({ length: count }, () => {
        return Math.max(0, parseFloat((base + (Math.random() * variance - variance / 2)).toFixed(2)));
    });
};

const generateDates = (count: number): string[] => {
    const dates = [];
    const now = new Date();
    for (let i = count - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
};

export const getMockMeters = (): MeterData[] => {
    const historyCount = 14;
    const historyDates = generateDates(historyCount);

    // Electricity Meter with 2 Tariffs (Day/Night)
    const electricityMeter: M_ELECM = {
        id: 'elec-001',
        name: 'Main Electricity',
        type: 'M_ELECM',
        MeteringDeviceType: MeteringDeviceType.Electricity,
        Manufacturer: 1001,
        IdentificationNumber: 88429102,
        VersionNumber: 2,
        DeviceStatus: 0,
        OperatingTime: 15000000,
        OnTime: 14900000,
        CurrentDate: new Date().toISOString(),
        UserText: "Basement Dist. Panel",
        Currency: "EUR",
        AccumulatedCost: 450.25,
        CurrentCredit: 0,
        BatteryStatus: BatteryStatus.High,
        Mode: MeterMode.Normal,
        
        CurrentEnergyConsumption: 14502.5,
        CurrentEnergyProduction: 120.5,
        CurrentActivePowerConsumption: 2.4, // kW
        CurrentActivePowerProduction: 0,
        CurrentReactiveEnergy: 120.5,
        ReliabilityOfMeteringData: true,
        BreakerState: BreakerValveState.Closed,
        CurrentTariff: 1,
        
        // Tariffs 1 and 2 populated
        CurrentEnergyConsumptionTariffs: [8500.2, 6002.3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        CurrentEnergyProductionTariffs: [120.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

        PowerThresholdStatus: PowerThresholdStatus.Low,
        PowerThresholdValue: 15.0, // kW
        
        HistoryDate: historyDates,
        HistoryEnergyConsumptionTariff1: generateHistory(15, 5, historyCount),
        HistoryEnergyProductionTariff1: generateHistory(1, 0.5, historyCount),
        HistoryStorageNumbers: Array.from({length: historyCount}, (_, i) => i + 1000)
    };

    // Heat Meter with Flow/Return Temps
    const heatMeter: M_HEATM = {
        id: 'heat-001',
        name: 'District Heating',
        type: 'M_HEATM',
        MeteringDeviceType: MeteringDeviceType.Heat,
        Manufacturer: 2040,
        IdentificationNumber: 55102933,
        VersionNumber: 1,
        DeviceStatus: 0,
        CurrentDate: new Date().toISOString(),
        UserText: "Utility Room",
        BatteryStatus: BatteryStatus.High,
        
        CurrentEnergyConsumption: 8900.2, // kWh
        TempFlowWater: 72.5,
        TempReturnWater: 45.2,
        TempDiffWater: 27.3,
        ReliabilityOfMeteringData: true,
        CurrentPower: 5.2,
        CurrentVolumeFlow: 0.8,
        CurrentEnergyConsumption_T1: 8900.2,
        
        HistoryDate: historyDates,
        HistoryEnergyConsumption: generateHistory(40, 10, historyCount),
        HistoryMaxPower: generateHistory(6, 1, historyCount),
        HistoryMinPower: generateHistory(2, 0.5, historyCount),
        HistoryVolumeMaxFlow: generateHistory(1.2, 0.2, historyCount),
        HistoryVolumeMinFlow: generateHistory(0.1, 0.05, historyCount),
        HistoryStorageNumbers: Array.from({length: historyCount}, (_, i) => i + 2000)
    };

    // Gas Meter with Temperature Conversion
    const gasMeter: M_GASM = {
        id: 'gas-001',
        name: 'Gas Supply',
        type: 'M_GASM',
        MeteringDeviceType: MeteringDeviceType.Gas,
        Manufacturer: 3301,
        IdentificationNumber: 11223344,
        VersionNumber: 3,
        DeviceStatus: 4, 
        BatteryStatus: BatteryStatus.Low,
        CurrentDate: new Date().toISOString(),
        UserText: "External Box",
        
        CurrentVolumeConsumption: 5430.12,
        CurrentVolumeFlow: 0.05,
        TempFlowGas: 12.0,
        MeasurementCondition: GasMeasurementCondition.TemperatureConverted,
        ReliabilityOfMeteringData: true,
        ValveState: BreakerValveState.Open, // Supply is interrupted (Open = off for valve acting as breaker? No, ValveState Open usually means flowing. But BreakerValveState: Open = 1 (Supply Interrupted). Wait. Standard says Open (Energy supply is intentionally interrupted). So Open = Off.)
        // Correction: Standard M_VALVEM Table 9: "Open (energy supply is intentionally interrupted)".
        // So Valve Open means NO FLOW. Valve Closed means Supply Active. This is counter-intuitive but that's the standard.
        // Let's set it to Closed (Active) for a working meter.
        
        CurrentEnergyConsumptionTariffs: [60000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        CurrentTariff: 1,
        
        HistoryDate: historyDates,
        HistoryVolumeConsumption: generateHistory(2, 0.5, historyCount),
        HistoryStorageNumbers: Array.from({length: historyCount}, (_, i) => i + 3000)
    };

    const waterMeter: M_WATERM = {
        id: 'water-001',
        name: 'Main Water',
        type: 'M_WATERM',
        MeteringDeviceType: MeteringDeviceType.Water,
        Manufacturer: 4005,
        IdentificationNumber: 99887766,
        DeviceStatus: 0,
        CurrentDate: new Date().toISOString(),
        BatteryStatus: BatteryStatus.Medium,
        
        CurrentVolumeConsumption: 1205.4,
        CurrentVolumeFlow: 0.0,
        TempFlowWater: 10.5,
        ReliabilityOfMeteringData: true,
        
        HistoryDate: historyDates,
        HistoryVolumeConsumption: generateHistory(0.4, 0.2, historyCount),
        HistoryStorageNumbers: Array.from({length: historyCount}, (_, i) => i + 4000)
    };

    const hcaMeter: M_HCA = {
        id: 'hca-001',
        name: 'Living Room Radiator',
        type: 'M_HCA',
        MeteringDeviceType: MeteringDeviceType.HeatCostAllocator,
        Manufacturer: 5001,
        IdentificationNumber: 777111,
        DeviceStatus: 0,
        BatteryStatus: BatteryStatus.High,
        CurrentEnergyConsumption: 450, // Units
        TempFlowWater: 55,
        TempExternal: 21,
        ReliabilityOfMeteringData: true,
        HistoryDate: historyDates,
        HistoryEnergyConsumption: generateHistory(2, 1, historyCount),
        HistoryStorageNumbers: Array.from({length: historyCount}, (_, i) => i + 5000)
    };

    const mainBreaker: M_BREAKERM = {
        id: 'brk-001',
        name: 'Main Circuit Breaker',
        type: 'M_BREAKERM',
        MeteringDeviceType: MeteringDeviceType.Breaker,
        BreakerState: BreakerValveState.Closed, // Closed = Active
        ReliabilityOfMeteringData: true,
        Manufacturer: 1001,
        IdentificationNumber: 12341234,
        DeviceStatus: 0,
        UserText: "Security Panel"
    };

    const gasValve: M_VALVEM = {
        id: 'vlv-001',
        name: 'Emergency Gas Valve',
        type: 'M_VALVEM',
        MeteringDeviceType: MeteringDeviceType.Valve,
        ValveState: BreakerValveState.Closed, // Closed = Active/Flowing
        ReliabilityOfMeteringData: true,
        Manufacturer: 3301,
        IdentificationNumber: 43214321,
        DeviceStatus: 0
    };

    return [electricityMeter, heatMeter, gasMeter, waterMeter, hcaMeter, mainBreaker, gasValve];
};