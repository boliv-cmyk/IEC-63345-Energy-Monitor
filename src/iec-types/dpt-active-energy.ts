
/**
 * IEC 63345:2023 Clause 8.9
 * DPT_ActiveEnergy (Table 20)
 * 
 * Format: 4 octets (V32) Signed Integer
 * Range: -2,147,483,648 ... 2,147,483,647 Wh
 * Resolution: 1 Wh
 * 
 * Note: The standard allows negative values (e.g. export vs import, or return).
 */
export type DPT_ActiveEnergy = number; // in Wh
