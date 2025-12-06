
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { M_ELECM } from '../functional-blocks/m-elecm';
import { M_GASM } from '../functional-blocks/m-gasm';
import { M_HEATM } from '../functional-blocks/m-heatm';
import { M_WATERM } from '../functional-blocks/m-waterm';
import { M_HCA } from '../functional-blocks/m-hca';
import { M_GENERICM } from '../functional-blocks/m-genericm';
import { M_BREAKERM } from '../functional-blocks/m-breakerm';
import { M_VALVEM } from '../functional-blocks/m-valve';
import { generateMockIECSystem } from '../utils/generators/mockIECData';
import { tickMeters } from '../utils/simulation/tickMeters';
import { updateTime } from '../utils/simulation/simulation-helpers';
import { BatteryStatus, BreakerValveState } from '../iec-types/enums';
import { useToast } from './ToastContext';

// Union type for all supported meters
export type IEC_Meter = 
    | M_ELECM 
    | M_GASM 
    | M_HEATM 
    | M_WATERM 
    | M_HCA 
    | M_GENERICM 
    | M_BREAKERM 
    | M_VALVEM;

export interface LogEntry {
    id: string;
    timestamp: Date;
    type: 'info' | 'warning' | 'error';
    source: string;
    message: string;
}

interface MDCContextType {
    meters: IEC_Meter[];
    lastUpdated: Date;
    refreshData: () => void;
    
    // Simulation
    isSimulating: boolean;
    simulationSpeed: number;
    setSimulationSpeed: (ms: number) => void;
    toggleSimulation: () => void;
    
    simulateNetworkLatency: boolean;
    toggleNetworkLatency: () => void;
    connectionQuality: number; // 0 to 100
    
    // Modes
    maintenanceMode: boolean;
    toggleMaintenanceMode: () => void;
    
    // Fault Injection & Control
    toggleReliability: (id: string) => void;
    toggleAlarm: (id: string) => void;
    acknowledgeAlarm: (id: string) => void;
    resetPeakValues: (id: string) => void;
    cycleBatteryStatus: (id: string) => void;
    toggleBreakerState: (id: string) => void;
    toggleValveState: (id: string) => void;

    // Logging
    eventLog: LogEntry[];
    clearEventLog: () => void;

    // Theme & UI
    darkMode: boolean;
    toggleDarkMode: () => void;
    compactMode: boolean;
    toggleCompactMode: () => void;
}

const MDCContext = createContext<MDCContextType | undefined>(undefined);

export const MDCProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [meters, setMeters] = useState<IEC_Meter[]>([]);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [isSimulating, setIsSimulating] = useState(true);
    const [simulationSpeed, setSimulationSpeed] = useState(3000);
    const [simulateNetworkLatency, setSimulateNetworkLatency] = useState(false);
    const [connectionQuality, setConnectionQuality] = useState(100);
    const [eventLog, setEventLog] = useState<LogEntry[]>([]);
    const { showToast } = useToast();

    // Preferences with Persistence
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('iec_darkMode');
        return saved ? JSON.parse(saved) : false;
    });
    
    const [compactMode, setCompactMode] = useState(() => {
        const saved = localStorage.getItem('iec_compactMode');
        return saved ? JSON.parse(saved) : false;
    });

    const [maintenanceMode, setMaintenanceMode] = useState(() => {
        const saved = localStorage.getItem('iec_maintenanceMode');
        return saved ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        localStorage.setItem('iec_darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    useEffect(() => {
        localStorage.setItem('iec_compactMode', JSON.stringify(compactMode));
    }, [compactMode]);

    useEffect(() => {
        localStorage.setItem('iec_maintenanceMode', JSON.stringify(maintenanceMode));
    }, [maintenanceMode]);

    const addLogEntry = (source: string, message: string, type: 'info' | 'warning' | 'error' = 'info') => {
        const entry: LogEntry = {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date(),
            source,
            message,
            type
        };
        setEventLog(prev => [entry, ...prev].slice(0, 100)); // Keep last 100 events
    };

    const clearEventLog = () => {
        setEventLog([]);
        showToast("Event Log Cleared", "info");
    };

    // Helper: Integrity Check
    const validateMeterIntegrity = (ms: IEC_Meter[]) => {
        ms.forEach(m => {
            let invalid = false;
            // Check History Array Parallelism
            if ('HistoryDate' in m && m.HistoryDate) {
                const dateLen = m.HistoryDate.length;
                
                if ('HistoryEnergyConsumption' in m && m.HistoryEnergyConsumption && m.HistoryEnergyConsumption.length !== dateLen) invalid = true;
                if ('HistoryVolumeConsumption' in m && m.HistoryVolumeConsumption && m.HistoryVolumeConsumption.length !== dateLen) invalid = true;
                if ('HistoryConsumption' in m && m.HistoryConsumption && m.HistoryConsumption.length !== dateLen) invalid = true;
            }

            if (invalid) {
                console.warn(`[IEC Validation] Integrity Error detected in meter ${m._internalId}. Resetting arrays.`);
                addLogEntry(m._name, "Data Integrity Check Failed (Array Mismatch)", "error");
            }
        });
    };

    // Initial Load
    useEffect(() => {
        setMeters(generateMockIECSystem());
        setTimeout(() => {
            showToast("H1 Interface Connected: Receiving Meter Data", "success");
            addLogEntry("System", "H1 Interface Connection Established", "info");
        }, 1000);
    }, []);

    // Simulation Loop
    useEffect(() => {
        if (!isSimulating) return;

        const interval = setInterval(() => {
            const updateLogic = () => {
                setMeters(prevMeters => {
                    const next = tickMeters(prevMeters);
                    if (Math.random() < 0.05) validateMeterIntegrity(next); 
                    return next;
                });
                setLastUpdated(new Date());
            };
            
            if (simulateNetworkLatency) {
                // Fluctuate quality
                const quality = Math.floor(Math.random() * 40) + 40; // 40-80%
                setConnectionQuality(quality);
                const delay = Math.random() * 1500 + 200;
                setTimeout(updateLogic, delay);
            } else {
                setConnectionQuality(100);
                updateLogic();
            }
            
        }, simulationSpeed);

        return () => clearInterval(interval);
    }, [isSimulating, simulationSpeed, simulateNetworkLatency]); 

    const refreshData = () => {
        setMeters(generateMockIECSystem());
        setLastUpdated(new Date());
        addLogEntry("System", "All meter data reset to initial state", "warning");
        showToast("System Reset: All meter data re-initialized", "info");
    };

    const toggleSimulation = () => {
        setIsSimulating(prev => !prev);
        const newState = !isSimulating;
        addLogEntry("Simulation", newState ? "Resumed" : "Paused", "info");
        showToast(newState ? "Simulation Resumed" : "Simulation Paused", "info");
    };

    const toggleNetworkLatency = () => {
        setSimulateNetworkLatency(prev => !prev);
        const newState = !simulateNetworkLatency;
        addLogEntry("Network", newState ? "Latency Simulation Enabled" : "Latency Simulation Disabled", "warning");
    };

    const toggleMaintenanceMode = () => {
        setMaintenanceMode(prev => !prev);
        const newState = !maintenanceMode;
        addLogEntry("System", newState ? "Maintenance Mode Activated" : "Maintenance Mode Deactivated", newState ? "warning" : "info");
        showToast(newState ? "Maintenance Mode Active" : "Maintenance Mode Disabled", "warning");
    };

    const toggleReliability = (id: string) => {
        setMeters(prev => prev.map(m => {
            if (m._internalId !== id) return m;
            const newReliability = !m.ReliabilityOfMeteringData;
            addLogEntry(m._name, `Data Reliability Changed to: ${newReliability}`, newReliability ? 'info' : 'error');
            return {
                ...m,
                ReliabilityOfMeteringData: newReliability
            };
        }));
        setLastUpdated(new Date());
    };

    const toggleAlarm = (id: string) => {
        setMeters(prev => prev.map(m => {
            if (m._internalId !== id) return m;
            
            let updated = { ...m };
            let alarmActive = false;

            // Helper to toggle alarm bit and set unack if raising alarm
            const toggleStatus = (mv: any) => {
                if (!mv || !mv.status) return mv;
                const wasInAlarm = mv.status.inAlarm;
                alarmActive = !wasInAlarm;
                
                return {
                    ...mv,
                    status: {
                        ...mv.status,
                        inAlarm: alarmActive,
                        alarmUnAck: alarmActive ? true : mv.status.alarmUnAck // Set UnAck true if alarm raises
                    }
                };
            };

            switch (m.type) {
                case 'M_ELECM':
                    if ('CurrentReactiveEnergy' in m && m.CurrentReactiveEnergy) {
                         (updated as M_ELECM).CurrentReactiveEnergy = toggleStatus(m.CurrentReactiveEnergy);
                    }
                    // For ELECM Table 7, there is no single primary MeteringValue with Z8 status for active energy.
                    // It uses DeviceStatus. We simulate general alarm via DeviceStatus bit 0.
                    updated.DeviceStatus = (updated.DeviceStatus || 0) ^ 0x01;
                    alarmActive = ((updated.DeviceStatus || 0) & 0x01) === 1;
                    break;
                case 'M_GASM':
                    (updated as M_GASM).CurrentVolumeConsumption = toggleStatus((m as M_GASM).CurrentVolumeConsumption);
                    break;
                case 'M_HEATM':
                    (updated as M_HEATM).CurrentEnergyConsumption = toggleStatus((m as M_HEATM).CurrentEnergyConsumption);
                    break;
                case 'M_WATERM':
                    (updated as M_WATERM).CurrentVolumeConsumption = toggleStatus((m as M_WATERM).CurrentVolumeConsumption);
                    break;
                case 'M_HCA':
                    (updated as M_HCA).CurrentEnergyConsumption = toggleStatus((m as M_HCA).CurrentEnergyConsumption);
                    break;
                case 'M_GENERICM':
                    (updated as M_GENERICM).CurrentConsumption = toggleStatus((m as M_GENERICM).CurrentConsumption);
                    break;
                default:
                    updated.DeviceStatus = (updated.DeviceStatus || 0) ^ 0x01;
                    alarmActive = ((updated.DeviceStatus || 0) & 0x01) === 1;
                    break;
            }
            
            addLogEntry(m._name, `Alarm Flag ${alarmActive ? 'SET' : 'CLEARED'}`, alarmActive ? 'error' : 'info');
            return updated;
        }));
        setLastUpdated(new Date());
    };

    const acknowledgeAlarm = (id: string) => {
        setMeters(prev => prev.map(m => {
            if (m._internalId !== id) return m;
            
            let updated = { ...m };
            let ackPerformed = false;

            const clearUnAck = (mv: any) => {
                if (!mv || !mv.status || !mv.status.alarmUnAck) return mv;
                ackPerformed = true;
                return {
                    ...mv,
                    status: {
                        ...mv.status,
                        alarmUnAck: false
                    }
                };
            };

            switch (m.type) {
                case 'M_GASM':
                    (updated as M_GASM).CurrentVolumeConsumption = clearUnAck((m as M_GASM).CurrentVolumeConsumption);
                    break;
                case 'M_HEATM':
                    (updated as M_HEATM).CurrentEnergyConsumption = clearUnAck((m as M_HEATM).CurrentEnergyConsumption);
                    break;
                case 'M_WATERM':
                    (updated as M_WATERM).CurrentVolumeConsumption = clearUnAck((m as M_WATERM).CurrentVolumeConsumption);
                    break;
                case 'M_HCA':
                    (updated as M_HCA).CurrentEnergyConsumption = clearUnAck((m as M_HCA).CurrentEnergyConsumption);
                    break;
                case 'M_GENERICM':
                    (updated as M_GENERICM).CurrentConsumption = clearUnAck((m as M_GENERICM).CurrentConsumption);
                    break;
                default:
                    break;
            }

            if (ackPerformed) {
                addLogEntry(m._name, "Alarm Acknowledged by Operator", "info");
                showToast("Alarm Acknowledged", "success");
            }
            return updated;
        }));
        setLastUpdated(new Date());
    };

    const resetPeakValues = (id: string) => {
        setMeters(prev => prev.map(m => {
            if (m._internalId !== id) return m;
            
            if (m.type === 'M_HEATM') {
                const nowDPT = updateTime(m.CurrentDate);
                addLogEntry(m._name, "Peak statistics manually reset", "info");
                return {
                    ...m,
                    MaxPower: { ...m.CurrentPower },
                    MinPower: { ...m.CurrentPower },
                    MaxPowerDate: nowDPT,
                    MinPowerDate: nowDPT
                };
            }
            return m;
        }));
        setLastUpdated(new Date());
        showToast("Peak Statistics Reset", "success");
    };

    const cycleBatteryStatus = (id: string) => {
        setMeters(prev => prev.map(m => {
            if (m._internalId !== id) return m;
            
            const current = m.BatteryStatus ?? BatteryStatus.High;
            let next = BatteryStatus.High;
            let levelStr = "High";
            
            if (current === BatteryStatus.High) { next = BatteryStatus.Medium; levelStr = "Medium"; }
            else if (current === BatteryStatus.Medium) { next = BatteryStatus.Low; levelStr = "Low"; }
            else { next = BatteryStatus.High; levelStr = "High"; }

            addLogEntry(m._name, `Battery Status changed to ${levelStr}`, next === BatteryStatus.Low ? 'warning' : 'info');

            return {
                ...m,
                BatteryStatus: next
            };
        }));
        setLastUpdated(new Date());
    };

    const toggleBreakerState = (id: string) => {
        setMeters(prev => prev.map(m => {
            if (m._internalId !== id) return m;
            if (m.type === 'M_BREAKERM') {
                const nextState = m.BreakerState === BreakerValveState.Closed 
                    ? BreakerValveState.Open 
                    : BreakerValveState.Closed;
                addLogEntry(m._name, `Breaker switched to ${nextState === BreakerValveState.Closed ? 'CLOSED' : 'OPEN'}`, 'warning');
                return { ...m, BreakerState: nextState };
            }
            if (m.type === 'M_ELECM') {
                const nextState = m.BreakerState === BreakerValveState.Closed 
                    ? BreakerValveState.Open 
                    : BreakerValveState.Closed;
                addLogEntry(m._name, `Internal Breaker switched to ${nextState === BreakerValveState.Closed ? 'CLOSED' : 'OPEN'}`, 'warning');
                return { ...m, BreakerState: nextState };
            }
            return m;
        }));
        setLastUpdated(new Date());
    };

    const toggleValveState = (id: string) => {
        setMeters(prev => prev.map(m => {
            if (m._internalId !== id) return m;
            if (m.type === 'M_VALVEM') {
                const nextState = m.ValveState === BreakerValveState.Closed 
                    ? BreakerValveState.Open 
                    : BreakerValveState.Closed;
                addLogEntry(m._name, `Valve switched to ${nextState === BreakerValveState.Closed ? 'CLOSED' : 'OPEN'}`, 'warning');
                return { ...m, ValveState: nextState };
            }
            if (m.type === 'M_GASM') {
                const nextState = m.ValveState === BreakerValveState.Closed 
                    ? BreakerValveState.Open 
                    : BreakerValveState.Closed;
                addLogEntry(m._name, `Internal Valve switched to ${nextState === BreakerValveState.Closed ? 'CLOSED' : 'OPEN'}`, 'warning');
                return { ...m, ValveState: nextState };
            }
            return m;
        }));
        setLastUpdated(new Date());
    };

    const toggleDarkMode = () => setDarkMode((prev: boolean) => !prev);
    const toggleCompactMode = () => setCompactMode((prev: boolean) => !prev);

    return (
        <MDCContext.Provider value={{ 
            meters, 
            lastUpdated, 
            refreshData, 
            isSimulating, 
            simulationSpeed,
            setSimulationSpeed,
            toggleSimulation,
            simulateNetworkLatency,
            toggleNetworkLatency,
            connectionQuality,
            maintenanceMode,
            toggleMaintenanceMode,
            toggleReliability,
            toggleAlarm,
            acknowledgeAlarm,
            resetPeakValues,
            cycleBatteryStatus,
            toggleBreakerState,
            toggleValveState,
            eventLog,
            clearEventLog,
            darkMode,
            toggleDarkMode,
            compactMode,
            toggleCompactMode
        }}>
            {children}
        </MDCContext.Provider>
    );
};

export const useMDC = () => {
    const context = useContext(MDCContext);
    if (!context) {
        throw new Error("useMDC must be used within an MDCProvider");
    }
    return context;
};
