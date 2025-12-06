
import { DPT_DateTime } from '../../iec-types/dpt-datetime';

interface DateTimeFormatOptions {
    includeSeconds?: boolean;
    showStatus?: boolean;
}

/**
 * Formats a DPT_DateTime object into a string.
 * Respects flags like noDate, noTime, noYear.
 */
export function formatDPTDateTime(dpt: DPT_DateTime | undefined, options: DateTimeFormatOptions = {}): string {
    if (!dpt) return '-';

    // Handle invalid structure cases defined in bits
    if (dpt.noDate && dpt.noTime) return 'Invalid Date/Time';

    const parts: string[] = [];

    // Date Part
    if (!dpt.noDate) {
        let dateStr = '';
        if (dpt.noYear) {
            // If year is invalid, show --/MM/DD
            dateStr = `--/${pad(dpt.month)}/${pad(dpt.dayOfMonth)}`;
        } else {
            // Full Date
            dateStr = `${dpt.year}-${pad(dpt.month)}-${pad(dpt.dayOfMonth)}`;
        }
        parts.push(dateStr);
    }

    // Time Part
    if (!dpt.noTime) {
        let timeStr = `${pad(dpt.hour)}:${pad(dpt.minute)}`;
        if (options.includeSeconds !== false) {
            timeStr += `:${pad(dpt.second)}`;
        }
        
        // Handle DST
        if (dpt.standardSummerTime === 1) {
            timeStr += ' (DST)';
        }
        parts.push(timeStr);
    }

    // Status Appends (Textual representation if needed)
    if (dpt.fault) parts.push('[FAULT]');
    if (dpt.qualityOfClock === 0) parts.push('[No Sync]');

    return parts.join(' ');
}

function pad(num: number): string {
    return num.toString().padStart(2, '0');
}
