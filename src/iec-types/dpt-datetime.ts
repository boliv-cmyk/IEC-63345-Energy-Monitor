
/**
 * IEC 63345:2023 Clause 8.13
 * Format of DPT_DateTime (Table 24)
 * 8 Octets
 */

export interface DPT_DateTime {
    year: number;       // Offset 1900. Range 0..255 (1900-2155)
    month: number;      // 1..12
    dayOfMonth: number; // 1..31
    dayOfWeek: number;  // 1=Monday...7=Sunday, 0=Any
    hour: number;       // 0..23 (24=Break at midnight, special case 8.13.2.2)
    minute: number;     // 0..59
    second: number;     // 0..59
    
    // Status Bits (Octet 2)
    fault: boolean;           // F (Bit 7)
    workingDay: boolean;      // WD (Bit 6)
    noWD: boolean;            // NWD (Bit 5) - WD field invalid
    noYear: boolean;          // NY (Bit 4) - Year invalid
    noDate: boolean;          // ND (Bit 3) - Month/Day invalid
    noDayOfWeek: boolean;     // NDOW (Bit 2) - DayOfWeek invalid
    noTime: boolean;          // NT (Bit 1) - Time fields invalid
    standardSummerTime: number; // SUTI (Bit 0) - 0=Standard, 1=Summer

    // Quality of Clock (Octet 1)
    qualityOfClock: number;   // CLQ (Bit 7)
    // Bits 6-0 reserved
}

/**
 * Raw buffer representation for transport simulation
 */
export type DPT_DateTime_Buffer = Uint8Array; // 8 bytes
