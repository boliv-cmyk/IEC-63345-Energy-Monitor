
import React from 'react';
import { M_HEATM } from '../../functional-blocks/m-heatm';
import { DPTRenderer_MeteringValue } from '../dpt-renderers/DPTRenderer_MeteringValue';
import { DPTRenderer_Float } from '../dpt-renderers/DPTRenderer_Float';
import { HistoryBarChart } from '../charts/HistoryBarChart';
import { HistoryLineChart } from '../charts/HistoryLineChart';
import { Thermometer, Activity, BarChart3, RefreshCcw, TrendingUp, Droplets } from 'lucide-react';
import { useMDC } from '../../context/MDCContext';

interface Props {
    meter: M_HEATM;
}

export const FB_HEATM: React.FC<Props> = ({ meter }) => {
    const { resetPeakValues } = useMDC();

    return (
        <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-rose-50 dark:bg-rose-900/20 rounded-xl p-5 border border-rose-100 dark:border-rose-900/50 shadow-sm">
                    <div className="flex items-center mb-3 text-rose-800 dark:text-rose-400">
                        <Activity size={18} className="mr-2" />
                        <h4 className="font-bold text-sm uppercase">Thermal Energy</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <DPTRenderer_MeteringValue 
                            value={meter.CurrentEnergyConsumption} 
                            label="Consumption" 
                            size="lg"
                        />
                        <DPTRenderer_MeteringValue 
                            value={meter.CurrentPower} 
                            label="Current Power" 
                            size="md"
                        />
                    </div>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-5 border border-orange-100 dark:border-orange-900/50 shadow-sm">
                    <div className="flex items-center mb-3 text-orange-800 dark:text-orange-400">
                        <Thermometer size={18} className="mr-2" />
                        <h4 className="font-bold text-sm uppercase">Temperatures</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <DPTRenderer_Float 
                            value={meter.TempFlowWater} 
                            unit="°C" 
                            label="Flow" 
                        />
                        <DPTRenderer_Float 
                            value={meter.TempReturnWater} 
                            unit="°C" 
                            label="Return" 
                        />
                        <DPTRenderer_Float 
                            value={meter.TempDiffWater} 
                            unit="K" 
                            label="Delta" 
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Energy History */}
                {meter.HistoryEnergyConsumption && (
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 transition-colors">
                        <div className="flex items-center mb-4 text-slate-700 dark:text-slate-300">
                            <BarChart3 size={18} className="mr-2" />
                            <h4 className="font-bold text-sm uppercase">Energy History</h4>
                        </div>
                        <HistoryBarChart 
                            dataValues={meter.HistoryEnergyConsumption} 
                            dates={meter.HistoryDate}
                            height={200}
                            color="#f43f5e"
                            title=""
                        />
                    </div>
                )}

                {/* Power Trend History */}
                {meter.HistoryMaxPower && meter.HistoryMinPower && (
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 transition-colors">
                        <div className="flex items-center mb-4 text-slate-700 dark:text-slate-300">
                            <TrendingUp size={18} className="mr-2" />
                            <h4 className="font-bold text-sm uppercase">Power Peaks</h4>
                        </div>
                        <HistoryLineChart 
                            series1={meter.HistoryMaxPower}
                            name1="Max Power"
                            color1="#f43f5e"
                            series2={meter.HistoryMinPower}
                            name2="Min Power"
                            color2="#3b82f6"
                            dates={meter.HistoryDate}
                            height={200}
                            title=""
                        />
                    </div>
                )}

                {/* Flow Trend History */}
                {meter.HistoryVolumeMaxFlow && meter.HistoryVolumeMinFlow && (
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 transition-colors lg:col-span-2">
                        <div className="flex items-center mb-4 text-slate-700 dark:text-slate-300">
                            <Droplets size={18} className="mr-2" />
                            <h4 className="font-bold text-sm uppercase">Flow Rate History (Min/Max)</h4>
                        </div>
                        <HistoryLineChart 
                            series1={meter.HistoryVolumeMaxFlow}
                            name1="Max Flow"
                            color1="#0ea5e9"
                            series2={meter.HistoryVolumeMinFlow}
                            name2="Min Flow"
                            color2="#64748b"
                            dates={meter.HistoryDate}
                            height={200}
                            title=""
                        />
                    </div>
                )}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden p-4 transition-colors">
                <div className="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">
                    <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Hydraulics & Stats</h3>
                    <button 
                        onClick={() => resetPeakValues(meter._internalId)}
                        className="flex items-center text-[10px] bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 px-2 py-1 rounded transition-colors"
                        title="Reset Max/Min Power Records"
                    >
                        <RefreshCcw size={10} className="mr-1" /> Reset Peaks
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                     <DPTRenderer_MeteringValue value={meter.CurrentVolumeFlow} label="Volume Flow" size="sm" />
                     <DPTRenderer_MeteringValue value={meter.MaxPower} label="Peak Power" size="sm" />
                     <DPTRenderer_MeteringValue value={meter.MinPower} label="Min Power" size="sm" />
                     <DPTRenderer_MeteringValue value={meter.ErrorConsumption} label="Error Consumption" size="sm" />
                </div>
            </div>
        </div>
    );
};
