import React from 'react';
import { MeterData, BreakerValveState } from '../types';
import { Zap, Flame, Thermometer, Droplets, Activity, ArrowUpRight, ShieldAlert, Power, Sliders, Shield } from 'lucide-react';

interface Props {
  meters: MeterData[];
  onSelectMeter: (id: string) => void;
}

const DashboardOverview: React.FC<Props> = ({ meters, onSelectMeter }) => {
  
  const getMeterSummary = (meter: MeterData) => {
    switch (meter.type) {
      case 'M_ELECM':
        return {
          value: meter.CurrentActivePowerConsumption.toFixed(2),
          unit: 'kW',
          secondary: `${meter.CurrentEnergyConsumption.toLocaleString()} kWh`,
          color: 'text-amber-500',
          bg: 'bg-amber-50',
          icon: <Zap className="text-amber-600" size={24} />
        };
      case 'M_GASM':
        return {
          value: meter.CurrentVolumeFlow.toFixed(3),
          unit: 'm³/h',
          secondary: `${meter.CurrentVolumeConsumption.toLocaleString()} m³`,
          color: 'text-emerald-500',
          bg: 'bg-emerald-50',
          icon: <Flame className="text-emerald-600" size={24} />
        };
      case 'M_HEATM':
        return {
          value: meter.CurrentPower.toFixed(2),
          unit: 'kW',
          secondary: `Flow: ${meter.TempFlowWater}°C`,
          color: 'text-rose-500',
          bg: 'bg-rose-50',
          icon: <Thermometer className="text-rose-600" size={24} />
        };
      case 'M_WATERM':
        return {
          value: meter.CurrentVolumeFlow.toFixed(3),
          unit: 'm³/h',
          secondary: `${meter.CurrentVolumeConsumption.toLocaleString()} m³`,
          color: 'text-blue-500',
          bg: 'bg-blue-50',
          icon: <Droplets className="text-blue-600" size={24} />
        };
      case 'M_HCA':
        return {
          value: meter.CurrentEnergyConsumption.toString(),
          unit: 'units',
          secondary: `Room: ${meter.TempExternal ?? '-'}°C`,
          color: 'text-orange-500',
          bg: 'bg-orange-50',
          icon: <Sliders className="text-orange-600" size={24} />
        };
      case 'M_BREAKERM':
        return {
          value: meter.BreakerState === BreakerValveState.Closed ? 'CLOSED' : 'OPEN',
          unit: '',
          secondary: 'Circuit Protection',
          color: meter.BreakerState === BreakerValveState.Closed ? 'text-green-600' : 'text-red-600',
          bg: meter.BreakerState === BreakerValveState.Closed ? 'bg-green-50' : 'bg-red-50',
          icon: <Power className={meter.BreakerState === BreakerValveState.Closed ? 'text-green-600' : 'text-red-600'} size={24} />
        };
      case 'M_VALVEM':
         return {
            // Note: IEC 63345: Valve Closed (0) = Active/Flowing. Valve Open (1) = Interrupted.
            value: meter.ValveState === BreakerValveState.Closed ? 'ACTIVE' : 'CUTOFF',
            unit: '',
            secondary: 'Flow Control',
            color: meter.ValveState === BreakerValveState.Closed ? 'text-green-600' : 'text-red-600',
            bg: meter.ValveState === BreakerValveState.Closed ? 'bg-green-50' : 'bg-red-50',
            icon: <ShieldAlert className={meter.ValveState === BreakerValveState.Closed ? 'text-green-600' : 'text-red-600'} size={24} />
         };
      default:
        return {
          value: '-',
          unit: '',
          secondary: 'Generic Meter',
          color: 'text-slate-500',
          bg: 'bg-slate-50',
          icon: <Activity className="text-slate-600" size={24} />
        };
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        
      {/* Introduction Card */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Activity size={120} />
        </div>
        <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-3 tracking-tight">Energy Efficiency System</h2>
            <p className="text-blue-100 max-w-2xl text-lg leading-relaxed">
            IEC 63345:2023 Compliant Simple External Consumer Display.
            Monitoring {meters.length} functional blocks across the H1 interface.
            </p>
        </div>
      </div>

      {/* Grid of Meters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {meters.map(meter => {
          const summary = getMeterSummary(meter);
          return (
            <div 
              key={meter.id}
              onClick={() => onSelectMeter(meter.id)}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${summary.bg} transition-colors group-hover:scale-105 duration-200`}>
                  {summary.icon}
                </div>
                {meter.DeviceStatus !== undefined && meter.DeviceStatus !== 0 && (
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded animate-pulse">
                    ALERT
                  </span>
                )}
              </div>
              
              <h3 className="text-slate-500 font-medium text-sm mb-1 uppercase tracking-wide">{meter.name}</h3>
              <div className="flex items-baseline space-x-1">
                <span className={`text-3xl font-bold ${summary.color}`}>{summary.value}</span>
                <span className="text-sm text-slate-500 font-medium">{summary.unit}</span>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs text-slate-400 font-medium truncate max-w-[150px]">{summary.secondary}</span>
                <div className="bg-slate-50 p-1 rounded-full group-hover:bg-blue-50 transition-colors">
                    <ArrowUpRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Standard Info Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center">
            <Shield size={18} className="mr-2 text-blue-600"/>
            IEC 63345 Topology Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors">
                <span className="block font-bold text-slate-700 mb-1">Local Network Access Point (LNAP)</span>
                <p className="text-slate-500 leading-relaxed">Connected. Providing access to H1 interface via meter communication functions.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors">
                <span className="block font-bold text-slate-700 mb-1">Data Consistency</span>
                <p className="text-slate-500 leading-relaxed">RxSequenceCounters synchronized across all functional blocks.</p>
            </div>
             <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors">
                <span className="block font-bold text-slate-700 mb-1">Display Unit</span>
                <p className="text-slate-500 leading-relaxed">Simple External Consumer Display (SECD) Active. Version 1.0.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;