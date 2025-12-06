
import { describe, it, expect } from 'vitest';
import { decodeDPTFloat } from '../decodeDPTFloat';

describe('decodeDPTFloat', () => {
    // Formula: (0.01 * M) * 2^E
    // M = 11 bits + sign (12 bits total, two's complement)
    // E = 4 bits

    it('should decode 0 correctly', () => {
        // M=0, E=0 -> 0x0000
        const result = decodeDPTFloat(0x0000);
        expect(result.value).toBe(0);
    });

    it('should decode a simple positive value', () => {
        // Value 1.00
        // 1.00 = (0.01 * 100) * 2^0
        // M = 100 (0x064), E = 0
        // Binary: 0000 (E) 000001100100 (M) -> 0x0064
        const result = decodeDPTFloat(0x0064);
        expect(result.value).toBe(1.00);
    });

    it('should decode a value with exponent', () => {
        // Value 200.00
        // 200 = (0.01 * 100) * 200 ??? No.
        // Formula: (0.01 * M) * 2^E
        // Try M=100, E=1 -> 1 * 2 = 2.00.
        // Let's try 0x0864 -> E=1, M=100. 
        // 0001 (E=1) 000001100100 (M=100) -> 0x0864
        const result = decodeDPTFloat(0x0864);
        expect(result.value).toBe(2.00);
    });

    it('should decode negative values (Twos Complement)', () => {
        // Value -1.00
        // -1.00 = (0.01 * -100) * 2^0
        // M = -100.
        // 12-bit Two's complement representation of -100:
        // 100 = 0000 0110 0100
        // Invert: 1111 1001 1011
        // Add 1:  1111 1001 1100 -> 0xF9C
        // E = 0.
        // Combined: 0000 (E) 1111 1001 1100 (M) -> 0x0F9C
        // Wait, M is extracted from specific bits.
        // Bit 15 is sign of M? No, float format is M EEEE M...
        // Let's re-read the decoder logic carefully.
        // Octet 2: M E E E E M M M
        // Octet 1: M M M M M M M M
        // E is bits 14-11.
        // M is Bit 15 (Sign) + Bits 10-0.
        
        // For -100 (0xF9C in 12-bit):
        // Bit 11 (Sign) is 1. Bits 10-0 are 111 1001 1100 (0x79C).
        // M_high_bit = 1.
        // E = 0 (0000).
        // Octet 2: 1 0000 111 -> 0x87
        // Octet 1: 1001 1100 -> 0x9C
        // Raw: 0x879C
        
        const result = decodeDPTFloat(0x879C);
        expect(result.value).toBe(-1.00);
    });

    it('should return NaN for Invalid Value (0x7FFF)', () => {
        const result = decodeDPTFloat(0x7FFF);
        expect(result.value).toBeNaN();
    });
});
