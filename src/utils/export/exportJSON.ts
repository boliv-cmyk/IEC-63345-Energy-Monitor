
import { IEC_Meter } from '../../context/MDCContext';

/**
 * Exports the IEC Meter object as a JSON file.
 * Useful for debugging state or transferring simulation data.
 */
export const exportToJSON = (data: IEC_Meter, filename: string): void => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${filename}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
