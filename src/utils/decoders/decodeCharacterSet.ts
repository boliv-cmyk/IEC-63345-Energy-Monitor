
/**
 * IEC 63345:2023 Clause 8.16
 * Decodes DPT_VarString_8859_1 (Table 27)
 * 
 * Uses ISO/IEC 8859-1 (Latin-1) encoding.
 * Strings are terminated by NULL (00h) or end of buffer.
 */
export function decodeCharacterSet(buffer: Uint8Array): string {
    // Find null terminator if present
    let end = buffer.length;
    for (let i = 0; i < buffer.length; i++) {
        if (buffer[i] === 0x00) {
            end = i;
            break;
        }
    }

    const slice = buffer.subarray(0, end);
    const decoder = new TextDecoder('iso-8859-1');
    return decoder.decode(slice);
}
