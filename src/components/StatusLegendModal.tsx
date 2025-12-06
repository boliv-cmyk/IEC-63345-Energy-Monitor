
import React from 'react';
import { Modal } from './ui/Modal';
import { StatusBadge } from './ui/StatusBadge';
import { AlertTriangle, ShieldAlert, Slash, Bell, BatteryCharging } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const StatusLegendModal: React.FC<Props> = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="IEC 63345 Status Legend">
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase border-b border-slate-100 dark:border-slate-700 pb-1">
                        Metering Value Flags (Z8)
                    </h4>
                    
                    <div className="flex items-start space-x-3">
                        <div className="mt-1">
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                <Slash size={10} className="mr-1" /> OOS
                            </span>
                        </div>
                        <div>
                            <div className="text-sm font-bold text-slate-700 dark:text-slate-300">Out Of Service</div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                The value is not currently being updated by the metering function. 
                                It may be stale or the sensor is disconnected.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <div className="mt-1">
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
                                <AlertTriangle size={10} className="mr-1" /> FLT
                            </span>
                        </div>
                        <div>
                            <div className="text-sm font-bold text-slate-700 dark:text-slate-300">Fault</div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                The value is corrupted or unreliable due to a physical device error or measurement failure.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <div className="mt-1">
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                <ShieldAlert size={10} className="mr-1" /> OVR
                            </span>
                        </div>
                        <div>
                            <div className="text-sm font-bold text-slate-700 dark:text-slate-300">Overridden</div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                The value has been locally overwritten or substituted (e.g. manual entry during maintenance).
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <div className="mt-1">
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                                <Bell size={10} className="mr-1" /> ALM
                            </span>
                        </div>
                        <div>
                            <div className="text-sm font-bold text-slate-700 dark:text-slate-300">In Alarm</div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                The value has crossed a configured threshold (e.g. High Temp, Low Pressure) defined in the meter.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase border-b border-slate-100 dark:border-slate-700 pb-1">
                        System Indicators
                    </h4>
                    
                    <div className="flex items-start space-x-3">
                        <div className="mt-1">
                            <StatusBadge type="success" label="Battery: High" />
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                            Device battery voltage is sufficient for normal operation.
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="mt-1">
                            <StatusBadge type="warning" label="Battery: Med" />
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                            Battery is degrading. Maintenance should be scheduled.
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="mt-1">
                            <StatusBadge type="error" label="Battery: Low" />
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                            Critical battery level. Device communication may stop imminent.
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
