
import { DPT_Float_F16 } from '../../iec-types/dpt-float';

/**
 * Formats a DPT_Float_F16 value.
 * Handles the special '7FFFh' invalid value case.
 */
export function formatDPTFloat(dpt: DPT_Float_F16 | undefined, decimals: number = 2): string {
    if (!dpt) return '-';

    // Check for specific invalid value raw 0x7FFF
    if (dpt.rawValue === 0x7FFF || isNaN(dpt.value)) {
        return 'Invalid';
    }

    return dpt.value.toFixed(decimals);
}
