
import { DPT_MeteringValue } from '../../iec-types/dpt-metering-value';
import { DPT_DateTime } from '../../iec-types/dpt-datetime';
import { formatDPTDateTime } from '../formatters/formatDPTDateTime';

/**
 * Converts parallel arrays of DPT_MeteringValue and DPT_DateTime into a CSV blob URL.
 * Strictly formatted for IEC 63345 data analysis.
 */
export const exportHistoryToCSV = (
    values: DPT_MeteringValue[], 
    dates: DPT_DateTime[], 
    filename: string
): void => {
    if (!values || !dates || values.length !== dates.length) {
        console.error("Export failed: Data arrays are mismatched or empty.");
        return;
    }

    // CSV Header
    const headers = ["Timestamp", "Value", "Unit", "VIF Code", "Status Hex"];
    const rows = values.map((val, idx) => {
        const dateStr = formatDPTDateTime(dates[idx], { includeSeconds: true });
        
        // Construct Status Byte Hex
        const statusByte = 
            (val.status.outOfService ? 1 : 0) |
            (val.status.fault ? 2 : 0) |
            (val.status.overridden ? 4 : 0) |
            (val.status.inAlarm ? 8 : 0) |
            (val.status.alarmUnAck ? 16 : 0);

        return [
            `"${dateStr}"`,
            val.value,
            `"${val.unit}"`,
            `0x${val.valInfField.toString(16).toUpperCase().padStart(2, '0')}`,
            `0x${statusByte.toString(16).toUpperCase().padStart(2, '0')}`
        ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    // Trigger download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${filename}_history.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
