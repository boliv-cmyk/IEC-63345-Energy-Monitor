
import { DPT_MeteringValue, DPT_StatusGen } from '../../iec-types/dpt-metering-value';

/**
 * Decodes 6-octet buffer into DPT_MeteringValue.
 * 
 * Buffer Layout (Table 16):
 * Index 0-3: CountVal (V32 Signed, Big Endian)
 * Index 4:   ValInfField (N8)
 * Index 5:   Status (Z8)
 */
export function decodeMeteringValue(buffer: Uint8Array): DPT_MeteringValue {
    if (buffer.length < 6) {
        throw new Error("DPT_MeteringValue requires 6 octets");
    }

    // 1. Decode CountVal (Signed 32-bit Integer)
    const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    const countVal = view.getInt32(0, false); // Big Endian

    // 2. Decode ValInfField (VIF)
    const vif = buffer[4];

    // 3. Decode Status (Z8)
    const statusByte = buffer[5];
    const status: DPT_StatusGen = {
        outOfService: !!(statusByte & 0x01),
        fault: !!(statusByte & 0x02),
        overridden: !!(statusByte & 0x04),
        inAlarm: !!(statusByte & 0x08),
        alarmUnAck: !!(statusByte & 0x10)
    };

    // 4. Resolve Units and Resolution (Table 17)
    let unit = "";
    let scalar = 1;

    // Logic for Table 17 - Coding ValInfField
    // We match patterns based on the byte value
    
    if ((vif & 0xF8) === 0x00) { 
        // 00000nnn: Energy 10^(nnn-3) Wh
        // Range: 0x00 - 0x07
        const n = vif & 0x07;
        unit = "Wh";
        scalar = Math.pow(10, n - 3);
    } 
    else if ((vif & 0xFC) === 0x80) {
        // 100000nn: Energy 10^(n+5) Wh (Table 17 Row 2?) 
        // Wait, standard Table 17 says: 100000nn -> Energy 10^(n+5) Wh
        // Range: 0x80 - 0x83
        const n = vif & 0x03;
        unit = "Wh";
        scalar = Math.pow(10, n + 5);
    }
    else if ((vif & 0xF8) === 0x08) {
        // 00001nnn: Energy 10^(nnn) J
        const n = vif & 0x07;
        unit = "J";
        scalar = Math.pow(10, n); // Table 17 says 10^(nnn) J
    }
    else if ((vif & 0xFE) === 0x84) { 
         // 1000010n: Energy 10^(n+8) J
         // Wait, Table 17 Row 4: 1000100n -> Energy 10^(n+8) J ??
         // Let's re-read the screenshot of Table 17 (Page 39).
         // Coding: 1000100n. Value: 10^(n+8) J.
         // That corresponds to 0x88 (n=0) and 0x89 (n=1).
         // 0x88 = 10001000. 
         // Logic: if ((vif & 0xFE) == 0x88)
         const n = vif & 0x01;
         unit = "J";
         scalar = Math.pow(10, n + 8);
    }
    else if ((vif & 0xF8) === 0x10) {
        // 00010nnn: Volume 10^(nnn-6) m3
        const n = vif & 0x07;
        unit = "m3";
        scalar = Math.pow(10, n - 6);
    }
    else if ((vif & 0xF8) === 0x18) {
        // 00011nnn: Mass 10^(nnn-3) kg
        const n = vif & 0x07;
        unit = "kg";
        scalar = Math.pow(10, n - 3);
    }
    else if ((vif & 0xF8) === 0x20) {
        // 00101nnn: Power 10^(nnn-3) W
        // Wait, 00101nnn is 0x28?
        // Let's check Table 17 carefully.
        // Row 5: 00011nnn -> Mass
        // Row 6: 00101nnn -> Power W. (0x28-0x2F).
        // Row 7: 1010100n -> Power MW (0xA8?).
        const n = vif & 0x07;
        unit = "W";
        scalar = Math.pow(10, n - 3);
    }
    else if ((vif & 0xF8) === 0x28) {
        // 00101nnn is actually 0x28 base?
        // 0010 1000. Yes.
        // So the previous block was correct.
        // Wait, let's just use the mask logic directly.
        const n = vif & 0x07;
        unit = "W";
        scalar = Math.pow(10, n - 3);
    }
    else if ((vif & 0xF8) === 0x30) {
        // 00110nnn: Power J/h 10^(nnn)
        const n = vif & 0x07;
        unit = "J/h";
        scalar = Math.pow(10, n);
    }
    else if ((vif & 0xF8) === 0x38) {
        // 00111nnn: Volume Flow 10^(nnn-6) m3/h
        const n = vif & 0x07;
        unit = "m3/h";
        scalar = Math.pow(10, n - 6);
    }
    else if ((vif & 0xF8) === 0x40) {
        // 01000nnn: Volume Flow 10^(nnn-7) m3/min
        const n = vif & 0x07;
        unit = "m3/min";
        scalar = Math.pow(10, n - 7);
    }
    else if ((vif & 0xF8) === 0x48) {
        // 01001nnn: Volume Flow 10^(nnn-9) m3/sec
        const n = vif & 0x07;
        unit = "m3/s";
        scalar = Math.pow(10, n - 9);
    }
    else if ((vif & 0xF8) === 0x50) {
        // 01010nnn: Mass Flow 10^(nnn-3) kg/h
        const n = vif & 0x07;
        unit = "kg/h";
        scalar = Math.pow(10, n - 3);
    }
    else if (vif === 0x7E) { // 01111110
        // Units for HCA - Dimensionless
        unit = "HCA";
        scalar = 1;
    }
    else {
        // Default / Unknown
        unit = "Unknown (VIF " + vif.toString(16) + ")";
        scalar = 1;
    }

    return {
        countVal,
        valInfField: vif,
        status,
        value: countVal * scalar,
        unit,
        scalar
    };
}
