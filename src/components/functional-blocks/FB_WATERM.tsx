
import React from 'react';
import { M_WATERM } from '../../functional-blocks/m-waterm';
import { DPTRenderer_MeteringValue } from '../dpt-renderers/DPTRenderer_MeteringValue';
import { DPTRenderer_Float } from '../dpt-renderers/DPTRenderer_Float';
import { HistoryBarChart } from '../charts/HistoryBarChart';
import { Droplets, Gauge, BarChart3 } from 'lucide-react';

interface Props {
    meter: M_WATERM;
}

export const FB_WATERM: React.FC<Props> = ({ meter }) => {
    return (
        <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 shadow-sm">
                    <div className="flex items-center mb-3 text-blue-800">
                        <Droplets size={18} className="mr-2" />
                        <h4 className="font-bold text-sm uppercase">Water Volume</h4>
                    </div>
                    <DPTRenderer_MeteringValue 
                        value={meter.CurrentVolumeConsumption} 
                        label="Accumulated Volume" 
                        size="lg"
                    />
                </div>

                <div className="bg-cyan-50 rounded-xl p-5 border border-cyan-100 shadow-sm">
                    <div className="flex items-center mb-3 text-cyan-800">
                        <Gauge size={18} className="mr-2" />
                        <h4 className="font-bold text-sm uppercase">Flow Data</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <DPTRenderer_Float 
                            value={meter.CurrentVolumeFlow} 
                            unit="m³/h" 
                            label="Current Flow" 
                        />
                        {meter.TempFlowWater && (
                            <DPTRenderer_Float 
                                value={meter.TempFlowWater} 
                                unit="°C" 
                                label="Water Temp" 
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* History Chart */}
            {meter.HistoryVolumeConsumption && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-center mb-4 text-slate-700">
                        <BarChart3 size={18} className="mr-2" />
                        <h4 className="font-bold text-sm uppercase">Volume History</h4>
                    </div>
                    <HistoryBarChart 
                        dataValues={meter.HistoryVolumeConsumption} 
                        dates={meter.HistoryDate}
                        height={240}
                        color="#3b82f6"
                        title=""
                    />
                </div>
            )}

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 border-b border-slate-100 pb-2">Table 4 Statistics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="flex flex-col">
                        <span className="text-xs text-slate-400 mb-1">Reliability</span>
                        <span className={`font-bold ${meter.ReliabilityOfMeteringData ? 'text-green-600' : 'text-red-600'}`}>
                            {meter.ReliabilityOfMeteringData ? 'Valid Data' : 'Invalid/Old'}
                        </span>
                     </div>
                     <DPTRenderer_MeteringValue value={meter.ErrorConsumption} label="Error Consumption" size="sm" />
                </div>
            </div>
        </div>
    );
};
