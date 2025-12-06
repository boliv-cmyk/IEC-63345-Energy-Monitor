
import React from 'react';
import { DPT_StatusGen } from '../../iec-types/dpt-metering-value';
import { AlertTriangle, ShieldAlert, Slash, Bell } from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';

interface Props {
    status: DPT_StatusGen;
    className?: string;
}

export const DPTRenderer_StatusGen: React.FC<Props> = ({ status, className }) => {
    // If all flags are false, don't render anything
    const hasFlags = status.outOfService || status.fault || status.overridden || status.inAlarm || status.alarmUnAck;
    if (!hasFlags) return null;

    return (
        <div className={`flex flex-wrap gap-1 ${className || ''}`}>
            {status.outOfService && (
                <Tooltip content="Out Of Service: The value is not currently being updated from the meter.">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 cursor-help">
                        <Slash size={10} className="mr-1" /> OOS
                    </span>
                </Tooltip>
            )}
            {status.fault && (
                <Tooltip content="Fault: The value is corrupted or unreliable due to a device error.">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 cursor-help">
                        <AlertTriangle size={10} className="mr-1" /> FLT
                    </span>
                </Tooltip>
            )}
            {status.overridden && (
                <Tooltip content="Overridden: The value has been locally overwritten.">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 cursor-help">
                        <ShieldAlert size={10} className="mr-1" /> OVR
                    </span>
                </Tooltip>
            )}
            {status.inAlarm && (
                <Tooltip content="In Alarm: The value has crossed a configured threshold.">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 cursor-help">
                        <Bell size={10} className="mr-1" /> ALM
                    </span>
                </Tooltip>
            )}
            {status.alarmUnAck && (
                <Tooltip content="Unacknowledged: The alarm state has not yet been acknowledged by the operator.">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800 animate-pulse cursor-help">
                        <Bell size={10} className="mr-1" /> UNACK
                    </span>
                </Tooltip>
            )}
        </div>
    );
};
