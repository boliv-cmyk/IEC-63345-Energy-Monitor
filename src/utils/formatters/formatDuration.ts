
/**
 * Formats a duration in seconds (DPT_LongDeltaTimeSec) to a human readable string.
 * Format: "Xh Ym" or "Xh" if minutes are 0.
 */
export function formatDuration(seconds: number | undefined): string {
    if (seconds === undefined || seconds === null) return '-';
    
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    
    if (h === 0 && m === 0) return '0m';
    if (m === 0) return `${h}h`;
    
    return `${h}h ${m}m`;
}
