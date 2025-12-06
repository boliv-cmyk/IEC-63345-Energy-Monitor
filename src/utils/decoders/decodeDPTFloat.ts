
import { DPT_Float_F16 } from '../../iec-types/dpt-float';

/**
 * Decodes a 2-octet F16 value according to IEC 63345 Clause 8.4 Table 12.
 * 
 * Format: 
 * Octet 2 (MSB): M E E E E M M M
 * Octet 1 (LSB): M M M M M M M M
 * 
 * Formula: FloatValue = (0.01 * M) * 2^E
 * 
 * @param rawValue 16-bit unsigned integer
 */
export function decodeDPTFloat(rawValue: number): DPT_Float_F16 {
    // Ensure 16-bit
    const u16 = rawValue & 0xFFFF;

    // Bit extraction based on diagram M E E E E M M M | M M M M M M M M
    // Bits: 15 14 13 12 11 10 09 08 | 07 06 05 04 03 02 01 00
    //       M  E  E  E  E  M  M  M | M  M  M  M  M  M  M  M
    
    // Exponent E is bits 14-11 (4 bits)
    const E = (u16 >> 11) & 0x0F; 

    // Mantissa M is bit 15 (Sign) + bits 10-0 (12 bits total)
    // We construct the 12-bit two's complement number
    
    const mHighBit = (u16 >> 15) & 0x01; // The sign bit of M
    const mLowerBits = u16 & 0x07FF;     // The lower 11 bits
    
    // Reconstruct the 12-bit M
    let M = (mHighBit << 11) | mLowerBits;

    // Handle 12-bit Two's Complement
    // If the 12th bit (bit index 11) is 1, it is negative.
    if ((M & 0x0800) !== 0) {
        M = M - 0x1000; // Subtract 2^12
    }

    // Special case check for invalid value
    // "For all Datapoint Types 9.xxx, the encoded value 7FFFh shall always be used to denote invalid data."
    // 7FFFh = 0111 1111 1111 1111
    // M = 2047, E = 15. 
    if (u16 === 0x7FFF) {
        return { rawValue: u16, value: NaN };
    }

    // Calculate
    const value = (0.01 * M) * Math.pow(2, E);

    return {
        rawValue: u16,
        value: Number(value.toPrecision(7)) // Avoid floating point artifacts
    };
}
