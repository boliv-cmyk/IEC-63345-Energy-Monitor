
import React from 'react';
import { M_GASM } from '../../functional-blocks/m-gasm';
import { DPTRenderer_MeteringValue } from '../dpt-renderers/DPTRenderer_MeteringValue';
import { DPTRenderer_Float } from '../dpt-renderers/DPTRenderer_Float';
import { HistoryBarChart } from '../charts/HistoryBarChart';
import { Flame, Gauge, BarChart3 } from 'lucide-react';
import { GasMeasurementCondition, BreakerValveState } from '../../iec-types/enums';

interface Props {
    meter: M_GASM;
}

export const FB_GASM: React.FC<Props> = ({ meter }) => {
    const getConditionLabel = (c?: GasMeasurementCondition) => {
        switch(c) {
            case GasMeasurementCondition.TemperatureConverted: return "Temp. Converted";
            case GasMeasurementCondition.AtBaseCondition: return "Base Condition";
            case GasMeasurementCondition.AtMeasurementCondition: return "Measurement Cond.";
            default: return "Unknown";
        }
    };

    return (
        <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100 shadow-sm">
                    <div className="flex items-center mb-3 text-emerald-800">
                        <Flame size={18} className="mr-2" />
                        <h4 className="font-bold text-sm uppercase">Gas Volume</h4>
                    </div>
                    <DPTRenderer_MeteringValue 
                        value={meter.CurrentVolumeConsumption} 
                        label="Accumulated Volume" 
                        size="lg"
                    />
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 shadow-sm">
                    <div className="flex items-center mb-3 text-slate-800">
                        <Gauge size={18} className="mr-2" />
                        <h4 className="font-bold text-sm uppercase">Flow Dynamics</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <DPTRenderer_Float 
                            value={meter.CurrentVolumeFlow} 
                            unit="m³/h" 
                            label="Current Flow" 
                        />
                        <DPTRenderer_Float 
                            value={meter.TempFlowGas} 
                            unit="°C" 
                            label="Gas Temp" 
                        />
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
                        color="#10b981"
                        title=""
                    />
                </div>
            )}

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 border-b border-slate-100 pb-2">Table 6 Status Data</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="flex flex-col">
                        <span className="text-xs text-slate-400 mb-1">Measurement Condition</span>
                        <span className="font-medium text-slate-800">{getConditionLabel(meter.MeasurementCondition)}</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-xs text-slate-400 mb-1">Valve State</span>
                        <span className={`font-bold ${meter.ValveState === BreakerValveState.Closed ? 'text-green-600' : 'text-red-600'}`}>
                            {meter.ValveState === BreakerValveState.Closed ? 'Closed (Active)' : 'Open (Cutoff)'}
                        </span>
                     </div>
                </div>
            </div>
        </div>
    );
};
