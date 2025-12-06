
import { DPT_Currency } from './dpt-currency';

/**
 * IEC 63345:2023 Clause 8.12
 * DPTs for price information (Table 23)
 * 
 * Format: 4 octets (V32) Signed
 * Range: -2 147 483 6,48 ... 2 147 483 6,47
 * Resolution: 0,01 currency
 */

export interface DPT_Price_Info {
    rawValue: number; // The V32 signed integer
    value: number;    // rawValue * 0.01
    currency: DPT_Currency; // Contextual currency (usually from another DPT)
}

// Table 23 Definitions
export type DPT_Cost = DPT_Price_Info;
export type DPT_Credit = DPT_Price_Info;

/**
 * Helper to construct the Price Info.
 * Note: The raw V32 buffer does NOT contain the currency. 
 * The currency is linked via DPT_Currency in the Functional Block.
 */
export function createDPTPrice(rawValue: number, currency: DPT_Currency): DPT_Price_Info {
    return {
        rawValue,
        value: Number((rawValue * 0.01).toFixed(2)),
        currency
    };
}
