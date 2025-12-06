
import React from 'react';
import { M_VALVEM } from '../../functional-blocks/m-valve';
import { BreakerValveState } from '../../iec-types/enums';
import { Shield, ShieldAlert, CheckCircle, AlertTriangle, XCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { useMDC } from '../../context/MDCContext';

interface Props {
    meter: M_VALVEM;
}

export const FB_VALVEM: React.FC<Props> = ({ meter }) => {
    const { toggleValveState } = useMDC();
    // IEC 63345: Closed (0) = Active Supply, Open (1) = Interrupted
    const isClosed = meter.ValveState === BreakerValveState.Closed;
    const isReleased = meter.ValveState === BreakerValveState.Released;

    return (
        <div className="flex flex-col items-center justify-center py-12 space-y-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
            <div className={`
                w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 relative
                ${isClosed 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                    : isReleased 
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                }
            `}>
                {isClosed ? <Shield size={64} /> : <ShieldAlert size={64} />}
                <div className={`absolute inset-0 rounded-full border-4 opacity-50 ${isClosed ? 'border-green-500' : 'border-red-500'} animate-pulse`}></div>
            </div>
            
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                    {isClosed ? 'Valve Closed' : isReleased ? 'Valve Released' : 'Valve Open'}
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
                        : isReleased
                            ? <><AlertTriangle size={16} className="mr-2"/> Manual Mode</>
                            : <><XCircle size={16} className="mr-2"/> Supply Cutoff</>
                    }
                </div>
            </div>
            
            <div className="w-full max-w-xs mt-8 pt-8 border-t border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-center text-sm mb-4">
                    <span className="text-slate-500 dark:text-slate-400">IEC 63345 Reliability</span>
                    {meter.ReliabilityOfMeteringData ? <StatusBadge type="success" label="Reliable" /> : <StatusBadge type="error" label="Unreliable" />}
                </div>

                <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-3">
                    <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 text-center">Manual Override (Sim)</span>
                    <button 
                        onClick={() => toggleValveState(meter._internalId)}
                        className={`w-full flex items-center justify-center px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                            isClosed
                            ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50'
                            : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50'
                        }`}
                    >
                        {isClosed ? <ToggleRight size={18} className="mr-2" /> : <ToggleLeft size={18} className="mr-2" />}
                        {isClosed ? 'Open Valve' : 'Close Valve'}
                    </button>
                 </div>
            </div>
        </div>
    );
};
