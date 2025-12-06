
/**
 * IEC 63345:2023 Clause 8.8
 * DPT_MeteringValue (Table 16)
 */

// Table 18 - Coding status (Z8)
export interface DPT_StatusGen {
    outOfService: boolean; // b0
    fault: boolean;        // b1
    overridden: boolean;   // b2
    inAlarm: boolean;      // b3
    alarmUnAck: boolean;   // b4
    // b5, b6, b7 reserved (set to 0)
}

// Table 17 & 16
// 6 Octets total
export interface DPT_MeteringValue {
    countVal: number;       // 4 octets (V32 Signed)
    valInfField: number;    // 1 octet (N8) - The raw VIF code
    status: DPT_StatusGen;  // 1 octet (Z8)

    // Derived values based on VIF (Table 17)
    value: number;          // The calculated human-readable value
    unit: string;           // e.g., "Wh", "m3", "W"
    scalar: number;         // The multiplier applied (e.g. 0.001)
}
