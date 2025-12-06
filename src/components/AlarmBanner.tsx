
import React from 'react';
import { Bell, AlertOctagon, CheckSquare, Wrench } from 'lucide-react';
import { useMDC } from '../context/MDCContext';

interface Props {
    inAlarm: boolean;
    alarmUnAck: boolean;
    deviceStatus: number;
    meterId?: string; // Add meterId to props to support ack action
}

export const AlarmBanner: React.FC<Props> = ({ inAlarm, alarmUnAck, deviceStatus, meterId }) => {
    const { acknowledgeAlarm, maintenanceMode } = useMDC();

    // If no alarm flags are active, return null
    if (!inAlarm && !alarmUnAck && deviceStatus === 0) return null;

    if (maintenanceMode) {
        return (
            <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 p-4 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300 opacity-80">
                <div className="flex items-center">
                    <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full mr-4 flex-shrink-0">
                        <Wrench className="text-blue-600 dark:text-blue-400" size={24} />
                    </div>
                    <div>
                        <h3 className="text-blue-900 dark:text-blue-200 font-bold text-lg mb-1">Alarm Suppressed</h3>
                        <p className="text-blue-700 dark:text-blue-300 text-sm">
                            Device alarm detected but suppressed due to active Maintenance Mode.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-start">
                <div className="bg-red-100 dark:bg-red-900/50 p-2 rounded-full mr-4 flex-shrink-0">
                    <Bell className="text-red-600 dark:text-red-400" size={24} />
                </div>
                <div>
                    <h3 className="text-red-900 dark:text-red-200 font-bold text-lg mb-1">Device Alarm Active</h3>
                    <p className="text-red-700 dark:text-red-300 text-sm mb-2">
                        The metering device has flagged an alarm condition via the IEC 63345 status interface.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {inAlarm && (
                            <span className="inline-flex items-center px-2 py-1 rounded bg-red-200 dark:bg-red-900/50 text-red-800 dark:text-red-200 text-xs font-bold uppercase border border-red-300 dark:border-red-800">
                                <AlertOctagon size={12} className="mr-1"/> DPT_StatusGen.inAlarm
                            </span>
                        )}
                        {alarmUnAck && (
                            <span className="inline-flex items-center px-2 py-1 rounded bg-orange-200 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200 text-xs font-bold uppercase animate-pulse border border-orange-300 dark:border-orange-800">
                                Unacknowledged
                            </span>
                        )}
                        {deviceStatus !== 0 && (
                            <span className="inline-flex items-center px-2 py-1 rounded bg-red-200 dark:bg-red-900/50 text-red-800 dark:text-red-200 text-xs font-bold uppercase font-mono border border-red-300 dark:border-red-800">
                                Status Code: 0x{deviceStatus.toString(16).toUpperCase()}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Acknowledge Button */}
            {alarmUnAck && meterId && (
                <button
                    onClick={() => acknowledgeAlarm(meterId)}
                    className="mt-4 sm:mt-0 sm:ml-4 flex items-center px-4 py-2 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg text-sm font-bold shadow-sm transition-colors"
                >
                    <CheckSquare size={16} className="mr-2" />
                    Acknowledge
                </button>
            )}
        </div>
    );
};
