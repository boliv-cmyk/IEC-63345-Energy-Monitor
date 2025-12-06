
import React from 'react';
import { M_HCA } from '../../functional-blocks/m-hca';
import { DPTRenderer_MeteringValue } from '../dpt-renderers/DPTRenderer_MeteringValue';
import { DPTRenderer_Float } from '../dpt-renderers/DPTRenderer_Float';
import { HistoryBarChart } from '../charts/HistoryBarChart';
import { Sliders, Thermometer, BarChart3 } from 'lucide-react';

interface Props {
    meter: M_HCA;
}

export const FB_HCA: React.FC<Props> = ({ meter }) => {
    return (
        <div className="space-y-6">
             <div className="bg-orange-50 rounded-xl p-6 border border-orange-100 shadow-sm text-center">
                <div className="flex items-center justify-center mb-4 text-orange-800">
                    <Sliders size={20} className="mr-2" />
                    <h4 className="font-bold text-sm uppercase">Heat Cost Allocation</h4>
                </div>
                <div className="flex justify-center">
                    <DPTRenderer_MeteringValue 
                        value={meter.CurrentEnergyConsumption} 
                        label="Accumulated Units" 
                        size="lg"
                        className="items-center"
                    />
                </div>
            </div>

            {/* History Chart */}
            {meter.HistoryEnergyConsumption && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-center mb-4 text-slate-700">
                        <BarChart3 size={18} className="mr-2" />
                        <h4 className="font-bold text-sm uppercase">Units History</h4>
                    </div>
                    <HistoryBarChart 
                        dataValues={meter.HistoryEnergyConsumption} 
                        dates={meter.HistoryDate}
                        height={240}
                        color="#f97316"
                        title=""
                    />
                </div>
            )}

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 border-b border-slate-100 pb-2">Table 3 Measurements</h3>
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-3 rounded-lg">
                        <Thermometer size={16} className="text-slate-400 mb-2" />
                        <DPTRenderer_Float 
                            value={meter.TempFlowWater} 
                            unit="°C" 
                            label="Radiator Temp" 
                        />
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                        <Thermometer size={16} className="text-slate-400 mb-2" />
                        <DPTRenderer_Float 
                            value={meter.TempExternal} 
                            unit="°C" 
                            label="Room Temp" 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
