
import { DPT_MeteringValue } from '../../iec-types/dpt-metering-value';

/**
 * Formats a DPT_MeteringValue into a combined string "Value Unit".
 */
export function formatMeteringValue(dpt: DPT_MeteringValue | undefined, decimals: number = 2): string {
    if (!dpt) return '-';

    // Check status first
    if (dpt.status.outOfService) return 'Out of Service';
    if (dpt.status.fault) return 'Fault';

    return `${dpt.value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: decimals })} ${dpt.unit}`;
}
