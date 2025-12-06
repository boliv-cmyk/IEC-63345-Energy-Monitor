
import React from 'react';
import { M_ELECM } from '../../functional-blocks/m-elecm';
import { DPTRenderer_MeteringValue } from '../dpt-renderers/DPTRenderer_MeteringValue';
import { DPTRenderer_Float } from '../dpt-renderers/DPTRenderer_Float';
import { DPTRenderer_DateTime } from '../dpt-renderers/DPTRenderer_DateTime';
import { HistoryBarChart } from '../charts/HistoryBarChart';
import { PowerGauge } from '../ui/PowerGauge';
import { Zap, Activity, BarChart3, AlertOctagon } from 'lucide-react';
import { BreakerValveState, PowerThresholdStatus } from '../../iec-types/enums';
import { StatusBadge } from '../ui/StatusBadge';

interface Props {
    meter: M_ELECM;
}

export const FB_ELECM: React.FC<Props> = ({ meter }) => {
    // Determine Threshold Status UI
    const getThresholdBadge = (status?: PowerThresholdStatus) => {
        switch (status) {
            case PowerThresholdStatus.High: 
                return <StatusBadge type="error" label="Overload" animate icon={<AlertOctagon size={12}/>} />;
            case PowerThresholdStatus.Medium: 
                return <StatusBadge type="warning" label="Warning" />;
            default: 
                return <StatusBadge type="success" label="Normal" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Primary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Active Power Gauge */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center">
                    <div className="w-full flex justify-between items-start mb-2">
                        <div className="flex items-center text-slate-700 dark:text-slate-300">
                            <Activity size={18} className="mr-2" />
                            <h4 className="font-bold text-sm uppercase">Load Monitor</h4>
                        </div>
                        {getThresholdBadge(meter.PowerThresholdStatus)}
                    </div>
                    
                    <PowerGauge 
                        value={meter.CurrentActivePowerConsumption.value}
                        max={25} // Hardcoded scale for demo
                        threshold={meter.PowerThresholdValue?.value}
                        unit="kW"
                        label="Active Power"
                        className="mt-2"
                    />
                    
                    <div className="w-full mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 grid grid-cols-2 gap-4 text-center">
                        <div>
                            <span className="text-[10px] text-slate-400 uppercase">Production</span>
                            <div className="font-mono font-medium text-emerald-600">
                                {meter.CurrentActivePowerProduction?.value.toFixed(2)} kW
                            </div>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-400 uppercase">Reactive</span>
                            <div className="font-mono font-medium text-blue-600">
                                {meter.CurrentReactiveEnergy?.value.toFixed(2)} kvar
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-100 dark:border-blue-800/50 shadow-sm">
                    <div className="flex items-center mb-3 text-blue-800 dark:text-blue-400">
                        <Zap size={18} className="mr-2" />
                        <h4 className="font-bold text-sm uppercase">Energy Totals</h4>
                    </div>
                    <div className="space-y-4">
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase mb-1">Total Import</span>
                            <span className="text-3xl font-bold text-slate-900 dark:text-white">
                                {(meter.CurrentEnergyConsumption / 1000).toLocaleString(undefined, {maximumFractionDigits: 1})}
                                <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">kWh</span>
                            </span>
                        </div>
                        {meter.CurrentEnergyProduction && (
                            <div className="flex flex-col pt-4 border-t border-blue-200/50 dark:border-blue-800/50">
                                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase mb-1">Total Export</span>
                                <span className="text-xl font-bold text-slate-900 dark:text-white">
                                    {(meter.CurrentEnergyProduction / 1000).toLocaleString(undefined, {maximumFractionDigits: 1})}
                                    <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">kWh</span>
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* History Chart */}
            {meter.HistoryEnergyConsumptionTariffs && meter.HistoryEnergyConsumptionTariffs[0] && (
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 transition-colors">
                    <div className="flex items-center mb-4 text-slate-700 dark:text-slate-300">
                        <BarChart3 size={18} className="mr-2" />
                        <h4 className="font-bold text-sm uppercase">Consumption History (Tariff 1)</h4>
                    </div>
                    <HistoryBarChart 
                        dataValues={meter.HistoryEnergyConsumptionTariffs[0]} 
                        dates={meter.HistoryDate}
                        height={240}
                        color="#f59e0b"
                    />
                </div>
            )}

            {/* Detailed Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
                <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/30 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                    <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">IEC 63345 Table 7 Data Points</h3>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                     <DPTRenderer_MeteringValue value={meter.CurrentReactiveEnergy} label="Reactive Energy" size="sm" />
                     
                     <div className="flex flex-col">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase mb-1">Breaker State</span>
                        <span className={`font-bold ${meter.BreakerState === BreakerValveState.Closed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {meter.BreakerState === BreakerValveState.Closed ? 'Closed (Active)' : 'Open (Interrupted)'}
                        </span>
                     </div>

                     <div className="flex flex-col">
                         <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase mb-1">Current Tariff</span>
                         <span className="font-mono text-slate-900 dark:text-slate-200">{meter.CurrentTariff || '-'}</span>
                     </div>
                     
                     {meter.PowerThresholdValue && (
                         <DPTRenderer_MeteringValue value={meter.PowerThresholdValue} label="Power Threshold" size="sm" />
                     )}
                     
                     <DPTRenderer_DateTime value={meter.MaxPowerDate} label="Max Power Date" compact />
                </div>
            </div>

            {/* Tariff Breakdown */}
            {meter.CurrentEnergyConsumptionTariffs && (
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
                    <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/30 border-b border-slate-100 dark:border-slate-700">
                        <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">Tariff Registers (Import)</h3>
                    </div>
                    <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {meter.CurrentEnergyConsumptionTariffs.map((val, idx) => (
                             <div key={idx} className={`p-2 rounded border ${meter.CurrentTariff === (idx + 1) ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-slate-50 dark:bg-slate-700/30 border-slate-100 dark:border-slate-700'}`}>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase mb-1">Tariff {idx + 1}</div>
                                <DPTRenderer_MeteringValue value={val} size="sm" />
                             </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
