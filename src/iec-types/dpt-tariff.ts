
/**
 * IEC 63345:2023 Clause 8.10
 * DPT for tariff information (Table 21)
 * 
 * Format: 8 bit (U8)
 * Octet no. 1
 */

export type DPT_Tariff = number;

export enum DPT_Tariff_SpecialValues {
    NoTariffAvailable = 0,
    // 1 to 254: current or desired value
    Reserved_NotTransmitted = 255
}
