
/**
 * IEC 63345:2023 Clause 8.4
 * Datapoint types "2-octet float value"
 */

// Table 12
// Format: 2 octets: F16
// Encoding: FloatValue = (0,01 * M) * 2^(E)
// M = [-2048 ... 2047] (Two's complement)
// E = [0 ... 15]
export interface DPT_Float_F16 {
    rawValue: number; // The 16-bit integer representation
    value: number;    // The calculated float value
}

// Specific instantiations of the float type (Table 12 Datapoint types)
export type DPT_Value_Temp = DPT_Float_F16;        // Unit: 0.01 degC
export type DPT_Value_Tempd = DPT_Float_F16;       // Unit: 0.01 K
export type DPT_Value_Tempa = DPT_Float_F16;       // Unit: 0.01 K/h
export type DPT_Value_Volume_Flow = DPT_Float_F16; // Unit: 0.01 l/h
export type DPT_Power = DPT_Float_F16;             // Unit: 0.01 kW
