
import { describe, it, expect } from 'vitest';
import { decodeDPTDateTime } from '../decodeDPTDateTime';

describe('decodeDPTDateTime', () => {
    it('should decode a standard date time correctly', () => {
        // Date: 2023-10-25 14:30:45
        // Year: 2023 - 1900 = 123 (0x7B)
        // Month: 10 (0x0A)
        // Day: 25 (0x19)
        // Hour: 14 (0x0E). DayOfWeek: 3 (Wed). 
        // Octet 5: (3 << 5) | 14 = 96 | 14 = 110 (0x6E)
        // Min: 30 (0x1E)
        // Sec: 45 (0x2D)
        // Status: 0 (Working Day=0?)
        // Quality: 0
        
        const buffer = new Uint8Array([
            0x7B, // Year
            0x0A, // Month
            0x19, // Day
            0x6E, // DoW | Hour
            0x1E, // Min
            0x2D, // Sec
            0x00, // Status
            0x00  // Quality
        ]);

        const result = decodeDPTDateTime(buffer);

        expect(result.year).toBe(2023);
        expect(result.month).toBe(10);
        expect(result.dayOfMonth).toBe(25);
        expect(result.dayOfWeek).toBe(3);
        expect(result.hour).toBe(14);
        expect(result.minute).toBe(30);
        expect(result.second).toBe(45);
    });

    it('should parse status flags correctly', () => {
        // Octet 2 (Index 6)
        // Bit 7: Fault (0x80)
        // Bit 0: Summer Time (0x01)
        // Value: 0x81
        
        const buffer = new Uint8Array(8);
        buffer[6] = 0x81;

        const result = decodeDPTDateTime(buffer);
        
        expect(result.fault).toBe(true);
        expect(result.standardSummerTime).toBe(1);
        expect(result.noDate).toBe(false); // Should be false by default if bit is 0
    });

    it('should throw error for insufficient buffer length', () => {
        const buffer = new Uint8Array(7);
        expect(() => decodeDPTDateTime(buffer)).toThrow();
    });
});
