
/**
 * IEC 63345:2023 Clause 8 Enumerations
 */

// Table 25: Metering Device Type (DPT_Metering_DeviceType)
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
    // 14-31 Reserved for reserved_unused
    Breaker = 32,
    Valve = 33,
    // 34-39 Reserved
    WasteWater = 40,
    // 41-254 Reserved
    Void = 255
}

// Table 29: Breaker/Valve State (DPT_Meter_BreakerValve_State)
// Clause 8.18
export enum BreakerValveState {
    Closed = 0,   // Supply is active/flowing (Note: Counter-intuitive but specified in standard)
    Open = 1,     // Supply is intentionally interrupted
    Released = 2, // Released for manual intervention
    Reserved = 3,
    Invalid = 255
}

// Table 30: Meter Mode (DPT_Meter_Mode)
// Clause 8.19
export enum MeterMode {
    Normal = 0,
    Prepayment = 1,
    Emergency = 2,
    Reserved = 3,
    Invalid = 255
}

// Table 32: Battery Status (DPT_Battery_Status)
// Clause 8.21
export enum BatteryStatus {
    Low = 0,
    Medium = 1,
    High = 2,
    Reserved = 3,
    Invalid = 255
}

// Table 31: Power Threshold Status (DPT_Power_Threshold_Status)
// Clause 8.20
export enum PowerThresholdStatus {
    Low = 0,
    Medium = 1,
    High = 2,
    Reserved = 3,
    Invalid = 255
}

// Table 28: Gas Measurement Condition (DPT_Gas_Measurement_Condition)
// Clause 8.17
export enum GasMeasurementCondition {
    Unknown = 0,
    TemperatureConverted = 1,
    AtBaseCondition = 2,
    AtMeasurementCondition = 3,
    Reserved = 4 // 4 to 255
}
