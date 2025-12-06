
/**
 * IEC 63345:2023 Clause 8.2 - 8.7 Primitive Types
 */

// Clause 8.2: Boolean value (Table 10)
// Format: 1 bit (B1)
// Range: 0 = False, 1 = True
export type DPT_Bool = boolean;

// Clause 8.3: 1-octet unsigned counter value (Table 11)
// Format: 8 bit (U8)
// Range: 0..255
export type DPT_Value_1_Ucount = number;

// Clause 8.5: 2-octet unsigned counter value (Table 13)
// Format: 16 bit (U16)
// Range: 0..65535
export type DPT_Value_2_Ucount = number;

// Clause 8.6: 4-octet signed unsigned counter value (Table 14)
// Note: Title says "signed unsigned", but definition U32 implies Unsigned. 
// Range is 0...4 294 967 295.
// Format: 4 octets (U32)
export type DPT_Value_4_Ucount = number;

// Clause 8.7: 4-octet signed time period (Table 15)
// Format: 4 octets (V32) Two's complement
// Range: -2 147 483 648 s ... 2 147 483 647 s
export type DPT_LongDeltaTimeSec = number;
