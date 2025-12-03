import React, { useState } from 'react';
import { 
    MeterData, 
    M_ELECM, 
    M_GASM, 
    M_HEATM, 
    M_WATERM, 
    M_HCA,
    M_BREAKERM,
    M_VALVEM,
    BreakerValveState,
    BatteryStatus,
    CommonMeterData,
    MeterMode,
    PowerThresholdStatus,
    GasMeasurementCondition
} from '../types';
import { 
    ResponsiveContainer, 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip,
    BarChart,
    Bar,
    LineChart,
    Line,
    Legend
} from 'recharts';
import { Clock, AlertTriangle, CheckCircle, Tag, Factory, Shield, Activity, DollarSign, List, BarChart3, Info, Grid, FileText } from 'lucide-react';

interface Props {
  meter: MeterData;
}

// Helpers
const getBatteryLabel = (status?: BatteryStatus) => {
    switch (status) {
        case BatteryStatus.Low: return { text: 'Low', color: 'text-red-600', bg: 'bg-red-50' };
        case BatteryStatus.Medium: return { text: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50' };
        case BatteryStatus.High: return { text: 'High', color: 'text-emerald-600', bg: 'bg-emerald-50' };
        default: return { text: 'Unknown', color: 'text-slate-400', bg: 'bg-slate-50' };
    }
};

const getBreakerStateLabel = (state?: BreakerValveState) => {
    // IEC 63345: Closed (0) = Active Supply, Open (1) = Interrupted Supply
    switch (state) {
        case BreakerValveState.Closed: return 'Closed (Active)';
        case BreakerValveState.Open: return 'Open (Interrupted)';
        case BreakerValveState.Released: return 'Released';
        default: return 'Unknown';
    }
};

const getGasConditionLabel = (cond?: GasMeasurementCondition) => {
    switch (cond) {
        case GasMeasurementCondition.TemperatureConverted: return 'Temp. Converted';
        case GasMeasurementCondition.AtBaseCondition: return 'At Base Condition';
        case GasMeasurementCondition.AtMeasurementCondition: return 'At Measurement Cond.';
        default: return 'Unknown';
    }
};

const formatDuration = (seconds?: number) => {
    if (seconds === undefined) return '-';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
};

// UI Components
const DataRow: React.FC<{ label: string; value: React.ReactNode; unit?: string; mono?: boolean }> = ({ label, value, unit, mono }) => (
    <div className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors px-2 -mx-2 rounded-lg">
        <span className="text-slate-500 text-sm">{label}</span>
        <span className={`text-slate-900 font-medium text-right ${mono ? 'font-mono text-xs' : ''}`}>
            {value !== undefined && value !== null ? value : '-'} 
            {unit && <span className="text-slate-400 ml-1 text-xs">{unit}</span>}
        </span>
    </div>
);

const SectionHeader: React.FC<{ title: string; icon?: React.ReactNode }> = ({ title, icon }) => (
    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center border-b border-slate-100 pb-2">
        {icon && <span className="mr-2 text-blue-600">{icon}</span>}
        {title}
    </h3>
);

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            active 
            ? 'bg-blue-600 text-white shadow-md' 
            : 'text-slate-600 hover:bg-slate-100'
        }`}
    >
        <span className="mr-2">{icon}</span>
        {label}
    </button>
);

const MeterDetail: React.FC<Props> = ({ meter }) => {
    const [activeTab, setActiveTab] = useState<'live' | 'history' | 'tariffs' | 'technical'>('live');

    // -- Tab Content Renderers --

    const renderLiveTab = () => (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Main Metrics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Specific Meter Metrics */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <SectionHeader title="Live Measurements" icon={<Activity size={16}/>} />
                    
                    {meter.type === 'M_ELECM' && (
                        <>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                                    <div className="text-xs text-amber-600 uppercase font-bold mb-1">Active Power</div>
                                    <div className="text-2xl font-bold text-amber-900">{meter.CurrentActivePowerConsumption} <span className="text-sm font-medium">kW</span></div>
                                </div>
                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <div className="text-xs text-blue-600 uppercase font-bold mb-1">Active Import</div>
                                    <div className="text-2xl font-bold text-blue-900">{meter.CurrentEnergyConsumption.toLocaleString()} <span className="text-sm font-medium">kWh</span></div>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <DataRow label="Reactive Energy" value={meter.CurrentReactiveEnergy} unit="kvarh" />
                                <DataRow label="Active Production (Export)" value={meter.CurrentEnergyProduction} unit="kWh" />
                                <DataRow label="Current Tariff" value={meter.CurrentTariff} />
                                <DataRow label="Breaker State" value={getBreakerStateLabel(meter.BreakerState)} />
                                <DataRow label="Power Threshold" value={`${meter.PowerThresholdValue} kW (${PowerThresholdStatus[meter.PowerThresholdStatus || 0]})`} />
                            </div>
                        </>
                    )}

                    {meter.type === 'M_HEATM' && (
                        <>
                           <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                                    <div className="text-xs text-rose-600 uppercase font-bold mb-1">Power</div>
                                    <div className="text-2xl font-bold text-rose-900">{meter.CurrentPower} <span className="text-sm font-medium">kW</span></div>
                                </div>
                                <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                                    <div className="text-xs text-orange-600 uppercase font-bold mb-1">Flow Temp</div>
                                    <div className="text-2xl font-bold text-orange-900">{meter.TempFlowWater} <span className="text-sm font-medium">°C</span></div>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <DataRow label="Return Temp" value={meter.TempReturnWater} unit="°C" />
                                <DataRow label="Temp Difference" value={meter.TempDiffWater} unit="K" />
                                <DataRow label="Volume Flow" value={meter.CurrentVolumeFlow} unit="m³/h" />
                                <DataRow label="Energy Consumption" value={meter.CurrentEnergyConsumption} unit="kWh" />
                            </div> 
                        </>
                    )}

                    {meter.type === 'M_GASM' && (
                        <>
                             <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                    <div className="text-xs text-emerald-600 uppercase font-bold mb-1">Volume</div>
                                    <div className="text-2xl font-bold text-emerald-900">{meter.CurrentVolumeConsumption.toLocaleString()} <span className="text-sm font-medium">m³</span></div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="text-xs text-slate-600 uppercase font-bold mb-1">Flow Rate</div>
                                    <div className="text-2xl font-bold text-slate-900">{meter.CurrentVolumeFlow} <span className="text-sm font-medium">m³/h</span></div>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <DataRow label="Gas Temperature" value={meter.TempFlowGas} unit="°C" />
                                <DataRow label="Condition" value={getGasConditionLabel(meter.MeasurementCondition)} />
                                <DataRow label="Valve State" value={getBreakerStateLabel(meter.ValveState)} />
                                <DataRow label="Current Tariff" value={meter.CurrentTariff} />
                            </div>
                        </>
                    )}

                    {meter.type === 'M_WATERM' && (
                         <>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <div className="text-xs text-blue-600 uppercase font-bold mb-1">Total Volume</div>
                                    <div className="text-2xl font-bold text-blue-900">{meter.CurrentVolumeConsumption.toLocaleString()} <span className="text-sm font-medium">m³</span></div>
                                </div>
                                <div className="p-4 bg-cyan-50 rounded-xl border border-cyan-100">
                                    <div className="text-xs text-cyan-600 uppercase font-bold mb-1">Current Flow</div>
                                    <div className="text-2xl font-bold text-cyan-900">{meter.CurrentVolumeFlow} <span className="text-sm font-medium">m³/h</span></div>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <DataRow label="Water Temp" value={meter.TempFlowWater} unit="°C" />
                            </div>
                         </>
                    )}

                    {meter.type === 'M_HCA' && (
                         <>
                            <div className="p-6 bg-orange-50 rounded-xl text-center mb-6 border border-orange-100">
                                <div className="text-sm text-orange-600 font-bold mb-2 uppercase">Accumulated Units</div>
                                <div className="text-4xl font-bold text-orange-900">{meter.CurrentEnergyConsumption}</div>
                            </div>
                            <div className="space-y-1">
                                <DataRow label="Surface Temp" value={meter.TempFlowWater} unit="°C" />
                                <DataRow label="Room Temp" value={meter.TempExternal} unit="°C" />
                            </div>
                         </>
                    )}

                    {(meter.type === 'M_BREAKERM' || meter.type === 'M_VALVEM') && (
                        <div className="flex flex-col items-center justify-center py-8">
                             <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 transition-colors ${
                                 (meter.type === 'M_BREAKERM' ? meter.BreakerState : meter.ValveState) === 0 
                                 ? 'bg-green-100 text-green-600' 
                                 : 'bg-red-100 text-red-600'
                             }`}>
                                <Shield size={48} />
                            </div>
                            <div className="text-2xl font-bold text-slate-800">
                                {meter.type === 'M_BREAKERM' 
                                    ? getBreakerStateLabel(meter.BreakerState)
                                    : getBreakerStateLabel(meter.ValveState)
                                }
                            </div>
                            <div className="text-slate-500 mt-2 text-center max-w-xs">
                                {(meter.type === 'M_BREAKERM' ? meter.BreakerState : meter.ValveState) === 0 
                                    ? "Supply is active and flowing normally." 
                                    : "Supply has been interrupted."
                                }
                            </div>
                        </div>
                    )}
                </div>

                {/* Status & Financials */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                         <SectionHeader title="Device Status" icon={<Info size={16}/>} />
                         <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col p-3 bg-slate-50 rounded-lg">
                                <span className="text-xs text-slate-500 mb-1">Battery</span>
                                {(() => {
                                    const b = getBatteryLabel(meter.BatteryStatus);
                                    return <span className={`font-bold ${b.color}`}>{b.text}</span>;
                                })()}
                            </div>
                            <div className="flex flex-col p-3 bg-slate-50 rounded-lg">
                                <span className="text-xs text-slate-500 mb-1">Operation Mode</span>
                                <span className="font-bold text-slate-800">{meter.Mode === MeterMode.Prepayment ? 'Prepayment' : 'Normal'}</span>
                            </div>
                            <div className="flex flex-col p-3 bg-slate-50 rounded-lg">
                                <span className="text-xs text-slate-500 mb-1">Data Reliability</span>
                                <span className={`font-bold ${meter.ReliabilityOfMeteringData ? 'text-green-600' : 'text-red-600'}`}>
                                    {meter.ReliabilityOfMeteringData ? 'Valid' : 'Invalid/Old'}
                                </span>
                            </div>
                             <div className="flex flex-col p-3 bg-slate-50 rounded-lg">
                                <span className="text-xs text-slate-500 mb-1">Device Status</span>
                                <span className="font-bold text-slate-800 font-mono">0x{(meter.DeviceStatus || 0).toString(16).toUpperCase()}</span>
                            </div>
                         </div>
                         {meter.UserText && (
                            <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-sm rounded-lg border border-blue-100 flex items-start">
                                <Info size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                                {meter.UserText}
                            </div>
                         )}
                         {meter.MeterReplacement && (
                            <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 text-sm rounded-lg border border-yellow-100 flex items-start">
                                <AlertTriangle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="font-bold block">Meter Replacement Detected</span>
                                    Counter: {meter.MeterReplacementCounter}
                                </div>
                            </div>
                         )}
                    </div>

                    {(meter.AccumulatedCost !== undefined || meter.CurrentCredit !== undefined) && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                             <SectionHeader title="Financial Information" icon={<DollarSign size={16}/>} />
                             <DataRow label="Currency" value={meter.Currency} />
                             <DataRow label="Accumulated Cost" value={meter.AccumulatedCost?.toFixed(2)} unit={meter.Currency} />
                             <DataRow label="Current Credit" value={meter.CurrentCredit?.toFixed(2)} unit={meter.Currency} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderHistoryTab = () => {
        // Construct chart data safely
        const historyDates = 'HistoryDate' in meter ? meter.HistoryDate : [];
        const data = (historyDates || []).map((date, idx) => {
            const entry: any = { date: date.split('T')[0] };
            if ('HistoryEnergyConsumption' in meter && meter.HistoryEnergyConsumption) entry.energy = meter.HistoryEnergyConsumption[idx];
            if ('HistoryEnergyConsumptionTariff1' in meter && meter.HistoryEnergyConsumptionTariff1) entry.energy = meter.HistoryEnergyConsumptionTariff1[idx];
            if ('HistoryVolumeConsumption' in meter && meter.HistoryVolumeConsumption) entry.volume = meter.HistoryVolumeConsumption[idx];
            return entry;
        }).reverse();

        return (
            <div className="space-y-6 animate-in fade-in duration-300">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <SectionHeader title="Historical Consumption" icon={<BarChart3 size={16}/>} />
                    <div className="h-80 w-full">
                         {data.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="date" tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                                    <YAxis tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                                    <Tooltip 
                                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                                    />
                                    <Legend />
                                    {entryHasKey(data[0], 'energy') && <Bar dataKey="energy" name="Energy" fill="#3b82f6" radius={[4, 4, 0, 0]} />}
                                    {entryHasKey(data[0], 'volume') && <Bar dataKey="volume" name="Volume" fill="#10b981" radius={[4, 4, 0, 0]} />}
                                </BarChart>
                            </ResponsiveContainer>
                         ) : (
                             <div className="h-full flex items-center justify-center text-slate-400">No History Data Available</div>
                         )}
                    </div>
                </div>

                {/* Raw History Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                     <div className="p-4 border-b border-slate-100 bg-slate-50">
                        <h3 className="text-sm font-bold text-slate-700 uppercase">Storage Log</h3>
                     </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-medium">
                                <tr>
                                    <th className="px-6 py-3">Storage #</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3 text-right">Value</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {('HistoryStorageNumbers' in meter ? meter.HistoryStorageNumbers || [] : []).map((num, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50">
                                        <td className="px-6 py-3 font-mono">{num}</td>
                                        <td className="px-6 py-3">{'HistoryDate' in meter ? meter.HistoryDate?.[idx]?.split('T')[0] || '-' : '-'}</td>
                                        <td className="px-6 py-3 text-right font-medium">
                                            {'HistoryEnergyConsumption' in meter && meter.HistoryEnergyConsumption?.[idx]}
                                            {'HistoryEnergyConsumptionTariff1' in meter && meter.HistoryEnergyConsumptionTariff1?.[idx]}
                                            {'HistoryVolumeConsumption' in meter && meter.HistoryVolumeConsumption?.[idx]}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     </div>
                </div>
            </div>
        );
    };

    const renderTariffsTab = () => {
        if (!('CurrentEnergyConsumptionTariffs' in meter) || !meter.CurrentEnergyConsumptionTariffs) {
            return <div className="p-12 text-center text-slate-400">No Tariff Data Available for this Meter Type</div>;
        }

        return (
            <div className="space-y-6 animate-in fade-in duration-300">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <SectionHeader title="Tariff Registers (1-16)" icon={<Grid size={16}/>} />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {meter.CurrentEnergyConsumptionTariffs.map((val, idx) => (
                            <div key={idx} className={`p-4 rounded-lg border ${meter.CurrentTariff === (idx + 1) ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-300' : 'bg-slate-50 border-slate-100'}`}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className={`text-xs font-bold uppercase ${meter.CurrentTariff === (idx + 1) ? 'text-blue-600' : 'text-slate-500'}`}>
                                        Tariff {idx + 1}
                                    </span>
                                    {meter.CurrentTariff === (idx + 1) && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
                                </div>
                                <div className={`text-lg font-bold ${val > 0 ? 'text-slate-800' : 'text-slate-400'}`}>
                                    {val.toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const renderTechnicalTab = () => (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <SectionHeader title="IEC 63345 Technical Specifications" icon={<Factory size={16}/>} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
                    <DataRow label="Manufacturer Code" value={meter.Manufacturer} mono />
                    <DataRow label="Identification Number" value={meter.IdentificationNumber} mono />
                    <DataRow label="Fabrication Number" value={meter.FabricationNumber} mono />
                    <DataRow label="Access Number" value={meter.AccessNumber} mono />
                    <DataRow label="Version" value={meter.VersionNumber} />
                    <DataRow label="Device Status Code" value={meter.DeviceStatus} mono />
                    <DataRow label="Operating Time" value={formatDuration(meter.OperatingTime)} />
                    <DataRow label="On Time" value={formatDuration(meter.OnTime)} />
                    <DataRow label="Rx Sequence Counter" value={meter.RxSequenceCounter} />
                    <DataRow label="Averaging Duration" value={'AveragingDuration' in meter ? meter.AveragingDuration : undefined} unit="sec" />
                    <DataRow label="Error Date" value={meter.ErrorDate?.split('T')[0]} />
                    <DataRow label="Last Rx Time" value={meter.RxReceptionTime?.split('T')[1]?.split('.')[0]} />
                </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <h4 className="text-blue-900 font-bold mb-2">Protocol Note</h4>
                <p className="text-blue-700 text-sm leading-relaxed">
                    This display implements the H1 interface data model as specified in IEC 63345. 
                    All data points shown are mapped directly from the metering functional blocks (FB).
                    Data consistency is verified via the RxSequenceCounter.
                </p>
            </div>
        </div>
    );

    function entryHasKey(entry: any, key: string) {
        return entry && Object.prototype.hasOwnProperty.call(entry, key);
    }

    return (
        <div>
            {/* Top Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center space-x-4">
                     <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                        <Tag size={24} />
                     </div>
                     <div>
                        <div className="flex items-center space-x-2 text-sm text-slate-500 mb-1">
                            <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-xs">ID: {meter.id}</span>
                            <span>•</span>
                            <span>{meter.type}</span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">{meter.name}</h1>
                     </div>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col items-end">
                    <div className="flex items-center space-x-2 text-sm font-medium text-slate-600 mb-2">
                        <Clock size={16} className="text-slate-400" />
                        <span>Last Update: {meter.CurrentDate?.split('T')[1]?.split('.')[0] || 'Now'}</span>
                    </div>
                     {meter.DeviceStatus !== 0 ? (
                        <span className="flex items-center text-red-600 bg-red-50 px-3 py-1 rounded-full text-xs font-bold border border-red-100">
                            <AlertTriangle size={14} className="mr-1" />
                            Status: Attention Required
                        </span>
                     ) : (
                        <span className="flex items-center text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">
                            <CheckCircle size={14} className="mr-1" />
                            Status: Normal
                        </span>
                     )}
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
                <TabButton active={activeTab === 'live'} onClick={() => setActiveTab('live')} icon={<Activity size={18}/>} label="Live Data" />
                <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<BarChart3 size={18}/>} label="History" />
                {(meter.type === 'M_ELECM' || meter.type === 'M_GASM') && (
                    <TabButton active={activeTab === 'tariffs'} onClick={() => setActiveTab('tariffs')} icon={<Grid size={18}/>} label="Tariffs" />
                )}
                <TabButton active={activeTab === 'technical'} onClick={() => setActiveTab('technical')} icon={<FileText size={18}/>} label="Technical" />
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {activeTab === 'live' && renderLiveTab()}
                {activeTab === 'history' && renderHistoryTab()}
                {activeTab === 'tariffs' && renderTariffsTab()}
                {activeTab === 'technical' && renderTechnicalTab()}
            </div>
        </div>
    );
};

export default MeterDetail;