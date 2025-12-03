/**
 * IEC 63345:2023 Data Models
 * Mapping standard tables to TypeScript Interfaces
 */

// Table 25: Metering Device Type
export enum MeteringDeviceType {
    Other = 0,
    Oil = 1,
    Electricity = 2,
    Gas = 3,
    Heat = 4,
    Steam = 5,
    WarmWater = 6,
    Water = 7,
    HeatCostAllocator = 8,
    Reserved9 = 9,
    CoolingLoadMeterOutlet = 10,
    CoolingLoadMeterInlet = 11,
    HeatInlet = 12,
    HeatAndCool = 13,
    // 14-31 Reserved
    Breaker = 32,
    Valve = 33,
    // 34-39 Reserved
    WasteWater = 40,
    // 41-254 Reserved
    Void = 255
}

// Table 29: Breaker/Valve State (DPT_Meter_BreakerValve_State)
export enum BreakerValveState {
    Closed = 0,   // Supply is active/flowing
    Open = 1,     // Supply is interrupted
    Released = 2, // Released for manual intervention
    Reserved = 3,
    Invalid = 255
}

// Table 30: Meter Mode (DPT_Meter_Mode)
export enum MeterMode {
    Normal = 0,
    Prepayment = 1,
    Emergency = 2,
    Reserved = 3,
    Invalid = 255
}

// Table 32: Battery Status (DPT_Battery_Status)
export enum BatteryStatus {
    Low = 0,
    Medium = 1,
    High = 2,
    Reserved = 3,
    Invalid = 255
}

// Table 31: Power Threshold Status (DPT_Power_Threshold_Status)
export enum PowerThresholdStatus {
    Low = 0,
    Medium = 1,
    High = 2,
    Reserved = 3,
    Invalid = 255
}

// Table 28: Gas Measurement Condition (DPT_Gas_Measurement_Condition)
export enum GasMeasurementCondition {
    Unknown = 0,
    TemperatureConverted = 1,
    AtBaseCondition = 2,
    AtMeasurementCondition = 3,
    Reserved = 4
}

// Common fields found in functional blocks (Tables 2-9)
// These generally map to the "H1 interface" data model.
export interface CommonMeterData {
    id: string; // Internal App ID (not part of standard, for React keys)
    name: string; // Display Name (Internal)

    // Common Data Points
    RxSequenceCounter?: number; // DPT_Value_1_Ucount (0..255)
    RxReceptionTime?: string; // DPT_DateTime (ISO String)
    Manufacturer?: number; // DPT_Value_2_Ucount (Manufacturer code)
    IdentificationNumber?: number; // DPT_Value_4_Ucount (8 digit BCD)
    VersionNumber?: number; // DPT_Value_1_Ucount
    MeteringDeviceType: MeteringDeviceType;
    FabricationNumber?: number; // DPT_Value_4_Ucount
    AccessNumber?: number; // DPT_Value_1_Ucount
    DeviceStatus?: number; // DPT_Value_1_Ucount (Bitset)
    OperatingTime?: number; // DPT_LongDeltaTimeSec
    OnTime?: number; // DPT_LongDeltaTimeSec
    CurrentDate?: string; // DPT_DateTime
    ErrorDate?: string; // DPT_DateTime
    MeteringRawData?: number[]; // DPT_Value_1_Ucount[n]
    UserText?: string; // DPT_VarString_8859_1
    MeterReplacement?: boolean; // DPT_Bool
    MeterReplacementCounter?: number; // DPT_Value_1_Ucount
    Currency?: string; // DPT_Currency
    AccumulatedCost?: number; // DPT_Cost
    CurrentCredit?: number; // DPT_Credit
    Mode?: MeterMode; // DPT_Meter_Mode
    BatteryStatus?: BatteryStatus; // DPT_Battery_Status
}

// Table 2: M_HEATM (Heat Meter)
export interface M_HEATM extends CommonMeterData {
    type: 'M_HEATM';
    CurrentEnergyConsumption: number; // DPT_MeteringValue
    TempFlowWater: number; // DPT_Value_Temp (0.01 degC)
    TempReturnWater: number; // DPT_Value_Temp
    TempDiffWater: number; // DPT_Value_Tempd
    ReliabilityOfMeteringData: boolean; // DPT_Bool
    CurrentPower: number; // DPT_MeteringValue (Power)
    CurrentVolumeFlow: number; // DPT_MeteringValue (Flow)
    CurrentEnergyConsumption_T1?: number; // Tariff 1
    
    // History Arrays (Parallel arrays)
    HistoryStorageNumbers?: number[];
    HistoryDate?: string[];
    HistoryEnergyConsumption?: number[];
    HistoryEnergyConsumption_T1?: number[];
    HistoryVolumeMaxFlow?: number[];
    HistoryVolumeMinFlow?: number[];
    HistoryMaxPower?: number[];
    HistoryMinPower?: number[];

    // Specifics
    MaxPowerDate?: string;
    MaxPower?: number;
    MinPowerDate?: string;
    MinPower?: number;
    ErrorConsumption?: number;
    AveragingDuration?: number;
}

// Table 3: M_HCA (Heat Cost Allocator)
export interface M_HCA extends CommonMeterData {
    type: 'M_HCA';
    CurrentEnergyConsumption: number; // Accumulated HCA units
    TempFlowWater?: number; // Radiator temperature
    TempExternal?: number; // Room temperature
    ReliabilityOfMeteringData: boolean;
    
    HistoryStorageNumbers?: number[];
    HistoryDate?: string[];
    HistoryEnergyConsumption?: number[]; 
    
    ErrorConsumption?: number;
    AveragingDuration?: number;
}

// Table 4: M_WATERM (Water Meter)
export interface M_WATERM extends CommonMeterData {
    type: 'M_WATERM';
    CurrentVolumeConsumption: number; // Accumulated volume
    CurrentVolumeFlow: number; // Current flow
    TempFlowWater?: number;
    ReliabilityOfMeteringData: boolean;
    
    HistoryStorageNumbers?: number[];
    HistoryDate?: string[];
    HistoryVolumeConsumption?: number[];
    HistoryVolumeMaxFlow?: number[];
    HistoryVolumeMinFlow?: number[];
    
    ErrorConsumption?: number;
    AveragingDuration?: number;
}

// Table 5: M_GENERICM (Generic Meter)
export interface M_GENERICM extends CommonMeterData {
    type: 'M_GENERICM';
    CurrentConsumption: number;
    ReliabilityOfMeteringData: boolean;
    
    HistoryStorageNumbers?: number[];
    HistoryDate?: string[];
    HistoryConsumption?: number[];
    
    ErrorConsumption?: number;
    AveragingDuration?: number;
}

// Table 6: M_GASM (Gas Meter)
export interface M_GASM extends CommonMeterData {
    type: 'M_GASM';
    CurrentVolumeConsumption: number;
    CurrentVolumeFlow: number;
    TempFlowGas?: number;
    MeasurementCondition?: GasMeasurementCondition;
    ValveState?: BreakerValveState;
    ReliabilityOfMeteringData: boolean;
    
    HistoryStorageNumbers?: number[];
    HistoryDate?: string[];
    HistoryVolumeConsumption?: number[];
    HistoryVolumeMaxFlow?: number[];
    HistoryVolumeMinFlow?: number[];
    
    // Tariffs 1 to 16
    // Represented as an array for cleaner TS. Index 0 = Tariff 1.
    CurrentEnergyConsumptionTariffs?: number[]; 
    HistoryEnergyConsumptionTariffs?: number[]; // Flattened or parallel structure. Simplified as array of values here.
    
    CurrentTariff?: number; // DPT_Tariff
    ErrorConsumption?: number;
    AveragingDuration?: number;
}

// Table 7: M_ELECM (Electricity Meter)
export interface M_ELECM extends CommonMeterData {
    type: 'M_ELECM';
    CurrentEnergyConsumption: number; // Import
    CurrentEnergyProduction?: number; // Export
    CurrentReactiveEnergy?: number;
    BreakerState?: BreakerValveState;
    ReliabilityOfMeteringData: boolean;
    
    // Tariffs 1 to 16
    CurrentEnergyConsumptionTariffs?: number[]; // Import Tariff 1-16
    CurrentEnergyProductionTariffs?: number[]; // Export Tariff 1-16
    
    // History
    HistoryStorageNumbers?: number[];
    HistoryDate?: string[];
    // We assume these are parallel arrays to HistoryStorageNumbers, 
    // but simplified: usually history is stored per tariff. 
    // For this app, we will visualize the total history or T1 history.
    HistoryEnergyConsumptionTariff1?: number[]; 
    HistoryEnergyProductionTariff1?: number[];
    
    CurrentActivePowerConsumption: number;
    CurrentActivePowerProduction?: number;
    CurrentTariff?: number; // DPT_Tariff
    
    PowerThresholdStatus?: PowerThresholdStatus;
    PowerThresholdValue?: number;
    
    AveragingDuration?: number;
}

// Table 8: M_BREAKERM (Breaker)
export interface M_BREAKERM extends CommonMeterData {
    type: 'M_BREAKERM';
    BreakerState: BreakerValveState;
    ReliabilityOfMeteringData: boolean;
}

// Table 9: M_VALVEM (Valve)
export interface M_VALVEM extends CommonMeterData {
    type: 'M_VALVEM';
    ValveState: BreakerValveState;
    ReliabilityOfMeteringData: boolean;
}

export type MeterData = M_ELECM | M_GASM | M_HEATM | M_WATERM | M_HCA | M_GENERICM | M_BREAKERM | M_VALVEM;