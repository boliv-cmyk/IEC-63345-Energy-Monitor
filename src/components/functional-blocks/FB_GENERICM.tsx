
import React from 'react';
import { M_GENERICM } from '../../functional-blocks/m-genericm';
import { DPTRenderer_MeteringValue } from '../dpt-renderers/DPTRenderer_MeteringValue';
import { HistoryBarChart } from '../charts/HistoryBarChart';
import { Box, Activity, BarChart3 } from 'lucide-react';

interface Props {
    meter: M_GENERICM;
}

export const FB_GENERICM: React.FC<Props> = ({ meter }) => {
    return (
        <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
                <div className="flex items-center mb-3 text-slate-800 dark:text-slate-200">
                    <Box size={18} className="mr-2" />
                    <h4 className="font-bold text-sm uppercase">Consumption Data</h4>
                </div>
                <DPTRenderer_MeteringValue 
                    value={meter.CurrentConsumption} 
                    label="Primary Metering Value" 
                    size="lg"
                />
            </div>

            {/* History Chart */}
            {meter.HistoryConsumption && (
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 transition-colors">
                    <div className="flex items-center mb-4 text-slate-700 dark:text-slate-300">
                        <BarChart3 size={18} className="mr-2" />
                        <h4 className="font-bold text-sm uppercase">History Data</h4>
                    </div>
                    <HistoryBarChart 
                        dataValues={meter.HistoryConsumption} 
                        dates={meter.HistoryDate}
                        height={240}
                        color="#64748b"
                        title=""
                    />
                </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden p-4 transition-colors">
                 <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">Table 5 Status</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                        <Activity size={16} className="mr-2 text-slate-400" />
                        Reliability: 
                        <span className={`ml-2 font-bold ${meter.ReliabilityOfMeteringData ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {meter.ReliabilityOfMeteringData ? 'OK' : 'FAULT'}
                        </span>
                    </div>
                    {meter.ErrorConsumption && (
                        <DPTRenderer_MeteringValue value={meter.ErrorConsumption} label="Error Value" size="sm" />
                    )}
                 </div>
            </div>
        </div>
    );
};
