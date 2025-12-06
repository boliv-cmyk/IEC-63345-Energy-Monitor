
import { DPT_Currency } from '../../iec-types/dpt-currency';

/**
 * Decodes U16 ISO 4217 Numeric Code into DPT_Currency
 * 
 * @param buffer Uint8Array (2 bytes) or number
 */
export function decodeCurrency(input: Uint8Array | number): DPT_Currency {
    let raw = 0;
    
    if (typeof input === 'number') {
        raw = input;
    } else {
        if (input.length < 2) throw new Error("DPT_Currency requires 2 octets");
        const view = new DataView(input.buffer, input.byteOffset, input.byteLength);
        raw = view.getUint16(0, false); // Big Endian assumption for standard network protocols
    }

    return {
        raw,
        code: getIso4217Code(raw)
    };
}

// Partial map of common ISO 4217 numeric codes
function getIso4217Code(numeric: number): string {
    switch(numeric) {
        case 978: return 'EUR';
        case 840: return 'USD';
        case 826: return 'GBP';
        case 392: return 'JPY';
        case 756: return 'CHF';
        case 124: return 'CAD';
        case 0: return 'No Currency';
        default: return `ISO-${numeric}`;
    }
}
