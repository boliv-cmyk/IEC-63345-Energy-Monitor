
import React from 'react';
import { M_BREAKERM } from '../../functional-blocks/m-breakerm';
import { BreakerValveState } from '../../iec-types/enums';
import { Power, ShieldAlert, CheckCircle, ZapOff, ToggleLeft, ToggleRight } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { useMDC } from '../../context/MDCContext';

interface Props {
    meter: M_BREAKERM;
}

export const FB_BREAKERM: React.FC<Props> = ({ meter }) => {
    const { toggleBreakerState } = useMDC();
    const isClosed = meter.BreakerState === BreakerValveState.Closed;
    const isReleased = meter.BreakerState === BreakerValveState.Released;

    return (
        <div className="flex flex-col items-center justify-center py-12 space-y-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
            <div className={`
                w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 relative
                ${isClosed 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)]' 
                    : isReleased
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.3)]'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                }
            `}>
                {isClosed ? <Power size={64} /> : <ZapOff size={64} />}
                
                {/* Visual Status Indicator Ring */}
                <div className={`absolute inset-0 rounded-full border-4 opacity-50 ${isClosed ? 'border-green-500' : 'border-red-500'} animate-pulse`}></div>
            </div>
            
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                    {isClosed ? 'Circuit Closed' : isReleased ? 'Circuit Released' : 'Circuit Open'}
                </h2>
                <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium ${
                    isClosed 
                        ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                        : isReleased
                            ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                            : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                }`}>
                    {isClosed 
                        ? <><CheckCircle size={16} className="mr-2"/> Supply Active</> 
                        : <><ShieldAlert size={16} className="mr-2"/> Supply Interrupted</>
                    }
                </div>
            </div>

            <div className="w-full max-w-xs mt-8 pt-8 border-t border-slate-100 dark:border-slate-700">
                 <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-slate-500 dark:text-slate-400">Data Reliability</span>
                    {meter.ReliabilityOfMeteringData ? (
                        <StatusBadge type="success" label="OK" />
                    ) : (
                        <StatusBadge type="error" label="FAULT" />
                    )}
                 </div>
                 <div className="flex justify-between items-center text-sm mb-6">
                    <span className="text-slate-500 dark:text-slate-400">IEC 63345 State</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">{meter.BreakerState}</span>
                 </div>

                 <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-3">
                    <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 text-center">Manual Override (Sim)</span>
                    <button 
                        onClick={() => toggleBreakerState(meter._internalId)}
                        className={`w-full flex items-center justify-center px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                            isClosed
                            ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50'
                            : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50'
                        }`}
                    >
                        {isClosed ? <ToggleRight size={18} className="mr-2" /> : <ToggleLeft size={18} className="mr-2" />}
                        {isClosed ? 'Trip Breaker' : 'Close Breaker'}
                    </button>
                 </div>
            </div>
        </div>
    );
};
