
import React from 'react';
import { IEC_Meter, useMDC } from '../context/MDCContext';
import { Factory, Info, Sliders, ZapOff, BellRing, BatteryCharging, Download, Printer, FileText, FileJson, FileSpreadsheet } from 'lucide-react';
import { DPTRenderer_DateTime } from './dpt-renderers/DPTRenderer_DateTime';
import { CopyToClipboard } from './ui/CopyToClipboard';
import { formatDuration } from '../utils/formatters/formatDuration';
import { exportHistoryToCSV } from '../utils/export/exportHistory';
import { exportToJSON } from '../utils/export/exportJSON';
import { useToast } from '../context/ToastContext';
import { Card } from './ui/Card';
import { TechRow } from './ui/TechRow';

interface Props {
    meter: IEC_Meter;
}

export const MeterTechnicalView: React.FC<Props> = ({ meter }) => {
    const { toggleReliability, toggleAlarm, cycleBatteryStatus } = useMDC();
    const { showToast } = useToast();

    const handleExportCSV = () => {
        let dataValues: any[] | undefined;
        let dates = ('HistoryDate' in meter) ? meter.HistoryDate : undefined;

        if (!dates) {
            showToast("No historical data available for export", "error");
            return;
        }

        if ('HistoryEnergyConsumption' in meter) dataValues = meter.HistoryEnergyConsumption;
        else if ('HistoryVolumeConsumption' in meter) dataValues = meter.HistoryVolumeConsumption;
        else if ('HistoryConsumption' in meter) dataValues = meter.HistoryConsumption;
        else if ('HistoryEnergyConsumptionTariffs' in meter && meter.HistoryEnergyConsumptionTariffs) {
            dataValues = meter.HistoryEnergyConsumptionTariffs[0];
        }

        if (dataValues && dates) {
            exportHistoryToCSV(dataValues, dates, `${meter._internalId}_diagnostic`);
            showToast("Diagnostic data exported to CSV", "success");
        } else {
            showToast("Primary history array not found for this meter type", "error");
        }
    };

    const handleExportJSON = () => {
        exportToJSON(meter, `${meter._internalId}_dump`);
        showToast("Full meter state exported to JSON", "success");
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-6">
            <Card className="print:hidden bg-slate-50/50 dark:bg-slate-800/50 border-dashed">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4 flex items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                    <Sliders size={16} className="mr-2 text-slate-600 dark:text-slate-400" />
                    H1 Interface Simulation Controls
                </h3>
                <div className="flex flex-wrap gap-4">
                    <button 
                        onClick={() => toggleReliability(meter._internalId)}
                        className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                            meter.ReliabilityOfMeteringData 
                            ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800' 
                            : 'bg-red-600 border-red-700 text-white hover:bg-red-700'
                        }`}
                    >
                        <ZapOff size={16} className="mr-2" />
                        {meter.ReliabilityOfMeteringData ? 'Simulate Data Fault' : 'Clear Data Fault'}
                    </button>

                    <button 
                        onClick={() => toggleAlarm(meter._internalId)}
                        className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:border-rose-800 transition-colors"
                    >
                        <BellRing size={16} className="mr-2" />
                        Toggle Alarm Bit
                    </button>

                    {meter.BatteryStatus !== undefined && (
                        <button 
                            onClick={() => cycleBatteryStatus(meter._internalId)}
                            className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-yellow-50 dark:hover:bg-yellow-900/30 hover:text-yellow-600 dark:hover:text-yellow-400 hover:border-yellow-200 dark:hover:border-yellow-800 transition-colors"
                        >
                            <BatteryCharging size={16} className="mr-2" />
                            Cycle Battery Status
                        </button>
                    )}
                </div>
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                    These controls inject flags into the mock H1 data stream to demonstrate the SECD reaction to IEC 63345 error states.
                </p>
            </Card>

            <Card>
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-2 mb-4 print:border-slate-300">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center">
                        <Factory size={16} className="mr-2 text-blue-600 dark:text-blue-400 print:text-black" />
                        Common Data (IEC 63345 Clause 5)
                    </h3>
                    <div className="flex space-x-2 print:hidden">
                        <button 
                            onClick={handlePrint}
                            className="flex items-center px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                            title="Print Report"
                        >
                            <Printer size={14} className="mr-1" />
                            Print
                        </button>
                        <button 
                            onClick={handleExportJSON}
                            className="flex items-center px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                            title="Export JSON"
                        >
                            <FileJson size={14} className="mr-1" />
                            JSON
                        </button>
                        <button 
                            onClick={handleExportCSV}
                            className="flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                            title="Export CSV"
                        >
                            <FileSpreadsheet size={14} className="mr-1" />
                            CSV
                        </button>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                    <TechRow 
                        label="Manufacturer Code" 
                        value={meter.Manufacturer} 
                        rawValue={meter.Manufacturer}
                        mono 
                    />
                    <TechRow 
                        label="Identification No." 
                        value={meter.IdentificationNumber} 
                        rawValue={meter.IdentificationNumber}
                        mono 
                    />
                    <TechRow 
                        label="Fabrication No." 
                        value={meter.FabricationNumber} 
                        rawValue={meter.FabricationNumber}
                        mono 
                    />
                    <TechRow 
                        label="Access Number" 
                        value={meter.AccessNumber} 
                        rawValue={meter.AccessNumber}
                        mono 
                    />
                    <TechRow 
                        label="Version Number" 
                        value={meter.VersionNumber} 
                        rawValue={meter.VersionNumber}
                    />
                    <TechRow 
                        label="Device Status" 
                        value={`0x${(meter.DeviceStatus || 0).toString(16).toUpperCase()}`} 
                        rawValue={`0x${(meter.DeviceStatus || 0).toString(16).toUpperCase()}`}
                        mono 
                    />
                    <TechRow label="Rx Sequence" value={meter.RxSequenceCounter} />
                    <TechRow label="Operating Time" value={formatDuration(meter.OperatingTime)} />
                    <TechRow label="On Time" value={formatDuration(meter.OnTime)} />
                </div>
            </Card>

            <Card className="print:mt-4 print:shadow-none print:border-0">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4 flex items-center border-b border-slate-100 dark:border-slate-700 pb-2 print:border-slate-300">
                    <Info size={16} className="mr-2 text-blue-600 dark:text-blue-400 print:text-black" />
                    Dates & Info
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-400 mb-1">Current Date (Meter Clock)</span>
                        <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-700 print:bg-transparent print:border-0 print:p-0">
                            <DPTRenderer_DateTime value={meter.CurrentDate} />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-400 mb-1">Error Date</span>
                        <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-700 print:bg-transparent print:border-0 print:p-0">
                            <DPTRenderer_DateTime value={meter.ErrorDate} />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-400 mb-1">Last Reception (Rx)</span>
                        <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-700 print:bg-transparent print:border-0 print:p-0">
                            <DPTRenderer_DateTime value={meter.RxReceptionTime} />
                        </div>
                    </div>
                    {meter.UserText && (
                        <div className="col-span-2 mt-2 p-3 bg-slate-50 dark:bg-slate-700/50 rounded border border-slate-100 dark:border-slate-600 text-sm italic text-slate-600 dark:text-slate-300 relative group print:bg-transparent print:border-slate-300">
                            <span className="flex items-center text-xs text-slate-400 not-italic mb-1"><FileText size={12} className="mr-1"/> User Text (8859-1)</span>
                            " {meter.UserText} "
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                                <CopyToClipboard text={meter.UserText} />
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};
