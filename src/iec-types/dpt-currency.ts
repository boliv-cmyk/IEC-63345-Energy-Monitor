
/**
 * IEC 63345:2023 Clause 8.11
 * DPT Currency (Table 22)
 * 
 * Format: U16
 * Value binary encoded according to ISO 4217 (Numeric code)
 * Range: 0 to 65 535
 */

export interface DPT_Currency {
    raw: number;     // The ISO 4217 Numeric Code
    code: string;    // The 3-letter Alpha Code (derived)
}
