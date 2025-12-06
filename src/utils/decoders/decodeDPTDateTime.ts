
import { DPT_DateTime } from '../../iec-types/dpt-datetime';

/**
 * Decodes 8-octet buffer into DPT_DateTime according to IEC 63345 Table 24.
 * 
 * Buffer Layout (Big Endian / Network Order assumption based on MSB->LSB notation):
 * Index 0 (Octet 8): Year
 * Index 1 (Octet 7): Month (Lower 4 bits)
 * Index 2 (Octet 6): DayOfMonth (Lower 5 bits)
 * Index 3 (Octet 5): DayOfWeek (Bits 7-5) | HourOfDay (Bits 4-0)
 * Index 4 (Octet 4): Minutes (Lower 6 bits)
 * Index 5 (Octet 3): Seconds (Lower 6 bits)
 * Index 6 (Octet 2): Status Bits (F, WD, NWD, NY, ND, NDOW, NT, SUTI)
 * Index 7 (Octet 1): Quality of Clock (CLQ on Bit 7)
 */
export function decodeDPTDateTime(buffer: Uint8Array): DPT_DateTime {
    if (buffer.length < 8) {
        throw new Error("DPT_DateTime requires 8 octets");
    }

    // Octet 8: Year (Offset 1900)
    const yearOffset = buffer[0];
    const year = 1900 + yearOffset;

    // Octet 7: Month (0 0 0 0 M M M M)
    const month = buffer[1] & 0x0F;

    // Octet 6: DayOfMonth (0 0 0 D D D D D)
    const dayOfMonth = buffer[2] & 0x1F;

    // Octet 5: DayOfWeek (3 bits) | HourOfDay (5 bits)
    // D D D H H H H H
    const octet5 = buffer[3];
    const dayOfWeek = (octet5 >> 5) & 0x07;
    const hour = octet5 & 0x1F;

    // Octet 4: Minutes (0 0 m m m m m m)
    const minute = buffer[4] & 0x3F;

    // Octet 3: Seconds (0 0 s s s s s s)
    const second = buffer[5] & 0x3F;

    // Octet 2: Status
    // Bit 7: Fault (F)
    // Bit 6: Working Day (WD)
    // Bit 5: No Working Day (NWD) - WD field invalid
    // Bit 4: No Year (NY)
    // Bit 3: No Date (ND)
    // Bit 2: No Day of Week (NDOW)
    // Bit 1: No Time (NT)
    // Bit 0: Standard Summer Time (SUTI)
    const octet2 = buffer[6];
    const fault = !!(octet2 & 0x80);
    const workingDay = !!(octet2 & 0x40);
    const noWD = !!(octet2 & 0x20);
    const noYear = !!(octet2 & 0x10);
    const noDate = !!(octet2 & 0x08);
    const noDayOfWeek = !!(octet2 & 0x04);
    const noTime = !!(octet2 & 0x02);
    const standardSummerTime = octet2 & 0x01; // 0=Standard, 1=Summer

    // Octet 1: Quality
    // Bit 7: CLQ
    const octet1 = buffer[7];
    const qualityOfClock = (octet1 >> 7) & 0x01;

    return {
        year,
        month,
        dayOfMonth,
        dayOfWeek,
        hour,
        minute,
        second,
        fault,
        workingDay,
        noWD,
        noYear,
        noDate,
        noDayOfWeek,
        noTime,
        standardSummerTime,
        qualityOfClock
    };
}
