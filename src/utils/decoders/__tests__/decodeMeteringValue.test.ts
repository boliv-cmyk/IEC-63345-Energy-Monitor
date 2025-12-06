
import { describe, it, expect } from 'vitest';
import { decodeMeteringValue } from '../decodeMeteringValue';

describe('decodeMeteringValue', () => {
    // Table 17 VIF decoding tests

    it('should decode Energy in Wh correctly (VIF 0x03)', () => {
        // VIF 0x03 -> 00000nnn where n=3.
        // Energy 10^(n-3) Wh -> 10^(0) = 1 Wh.
        // Value: 1000 (0x000003E8)
        const buffer = new Uint8Array([0, 0, 3, 232, 0x03, 0x00]); 
        const result = decodeMeteringValue(buffer);
        
        expect(result.countVal).toBe(1000);
        expect(result.unit).toBe('Wh');
        expect(result.scalar).toBe(1);
        expect(result.value).toBe(1000);
    });

    it('should decode Volume in m3 correctly (VIF 0x16)', () => {
        // VIF 0x16 -> 00010nnn where n=6.
        // Volume 10^(n-6) m3 -> 10^(0) = 1 m3.
        // Value: 500
        const buffer = new Uint8Array([0, 0, 1, 244, 0x16, 0x00]);
        const result = decodeMeteringValue(buffer);

        expect(result.countVal).toBe(500);
        expect(result.unit).toBe('m3');
        expect(result.scalar).toBe(1);
        expect(result.value).toBe(500);
    });

    it('should decode Power in W correctly (VIF 0x2B)', () => {
        // VIF 0x2B -> 00101nnn where n=3.
        // Power 10^(n-3) W -> 10^0 = 1 W.
        const buffer = new Uint8Array([0, 0, 0, 100, 0x2B, 0x00]);
        const result = decodeMeteringValue(buffer);

        expect(result.unit).toBe('W');
        expect(result.scalar).toBe(1);
        expect(result.value).toBe(100);
    });

    it('should decode HCA dimensionless units (VIF 0x7E)', () => {
        const buffer = new Uint8Array([0, 0, 0, 50, 0x7E, 0x00]);
        const result = decodeMeteringValue(buffer);

        expect(result.unit).toBe('HCA');
        expect(result.scalar).toBe(1);
        expect(result.value).toBe(50);
    });

    it('should parse status flags correctly (Z8)', () => {
        // Status Byte 0x0A (0000 1010) -> InAlarm(b3)=1, Fault(b1)=1
        const buffer = new Uint8Array([0, 0, 0, 0, 0x00, 0x0A]);
        const result = decodeMeteringValue(buffer);

        expect(result.status.fault).toBe(true);
        expect(result.status.inAlarm).toBe(true);
        expect(result.status.outOfService).toBe(false);
    });
});
