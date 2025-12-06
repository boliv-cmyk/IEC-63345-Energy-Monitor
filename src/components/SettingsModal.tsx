
import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { useMDC } from '../context/MDCContext';
import { Play, Pause, RefreshCw, Zap, Moon, Sun, Lock, Unlock, Network, Activity, Grid, Trash, Wrench } from 'lucide-react';
import { RangeSlider } from './ui/RangeSlider';
import { useToast } from '../context/ToastContext';
import { useAutoLock } from '../hooks/useAutoLock';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const { 
        isSimulating, 
        toggleSimulation, 
        simulationSpeed, 
        setSimulationSpeed, 
        simulateNetworkLatency,
        toggleNetworkLatency,
        maintenanceMode,
        toggleMaintenanceMode,
        refreshData,
        clearEventLog,
        darkMode,
        toggleDarkMode,
        compactMode,
        toggleCompactMode
    } = useMDC();
    const { showToast } = useToast();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pin, setPin] = useState(['', '', '', '']);
    
    // Auto-lock logic via hook
    useAutoLock(!isAuthenticated, () => {
        setIsAuthenticated(false);
        setPin(['', '', '', '']);
        showToast("Settings locked due to inactivity", "info");
    }, isOpen);

    const handlePinChange = (index: number, value: string) => {
        if (value.length > 1) return;
        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);

        if (value && index < 3) {
            const nextInput = document.getElementById(`pin-${index + 1}`);
            nextInput?.focus();
        }

        if (newPin.join('') === '0000') {
            setIsAuthenticated(true);
            showToast("Access Granted: Configuration Mode Unlocked", "success");
        }
    };

    const renderAuthScreen = () => (
        <div className="flex flex-col items-center justify-center py-8 space-y-6">
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full">
                <Lock size={32} className="text-slate-400 dark:text-slate-500" />
            </div>
            <div className="text-center">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Restricted Access</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Enter PIN to access system configuration.</p>
                <p className="text-xs text-slate-400 mt-1">(Hint: 0000)</p>
            </div>
            <div className="flex gap-3">
                {[0, 1, 2, 3].map((i) => (
                    <input
                        key={i}
                        id={`pin-${i}`}
                        type="password"
                        maxLength={1}
                        value={pin[i]}
                        onChange={(e) => handlePinChange(i, e.target.value)}
                        className="w-12 h-14 border border-slate-300 dark:border-slate-600 rounded-lg text-center text-2xl font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                ))}
            </div>
        </div>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="System Settings">
            {!isAuthenticated ? renderAuthScreen() : (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    
                    {/* Simulator State */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex justify-between items-center">
                            Interface Status
                            <div className="flex items-center text-xs font-normal text-slate-400 lowercase">
                                <Unlock size={12} className="text-green-500 mr-1" />
                                auto-locks in 60s
                            </div>
                        </label>
                        <div className="grid grid-cols-1 gap-3">
                            <button
                                onClick={toggleMaintenanceMode}
                                className={`flex items-center justify-center px-4 py-3 rounded-lg text-sm font-bold transition-colors border ${
                                    maintenanceMode
                                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400'
                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                                }`}
                            >
                                <Wrench size={16} className="mr-2" />
                                {maintenanceMode ? 'Maintenance Mode: ACTIVE' : 'Enable Maintenance Mode'}
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={toggleSimulation}
                                className={`flex items-center justify-center px-4 py-3 rounded-lg text-sm font-bold transition-colors ${
                                    isSimulating 
                                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50' 
                                    : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                                }`}
                            >
                                {isSimulating ? <><Pause size={16} className="mr-2"/> Pause Sim</> : <><Play size={16} className="mr-2"/> Resume Sim</>}
                            </button>

                            <button
                                onClick={toggleNetworkLatency}
                                className={`flex items-center justify-center px-4 py-3 rounded-lg text-sm font-bold transition-colors border ${
                                    simulateNetworkLatency
                                    ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400'
                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                                }`}
                            >
                                <Network size={16} className="mr-2" />
                                {simulateNetworkLatency ? 'Latency: ON' : 'Latency: OFF'}
                            </button>
                        </div>
                    </div>

                    {/* Appearance */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                            Appearance & Layout
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={toggleDarkMode}
                                className={`flex items-center justify-center p-3 rounded-lg border transition-colors ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                            >
                                {darkMode ? <Moon size={20} className="mr-2 text-purple-400" /> : <Sun size={20} className="mr-2 text-orange-500" />}
                                <span className="font-medium text-sm">{darkMode ? 'Dark' : 'Light'}</span>
                            </button>
                            <button 
                                onClick={toggleCompactMode}
                                className={`flex items-center justify-center p-3 rounded-lg border transition-colors ${compactMode ? 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300' : 'bg-white border-slate-200 text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-white'}`}
                            >
                                <Grid size={20} className="mr-2" />
                                <span className="font-medium text-sm">{compactMode ? 'Compact' : 'Standard'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Update Frequency */}
                    <div>
                        <RangeSlider 
                            label="Telegram Update Rate"
                            value={simulationSpeed}
                            min={500}
                            max={10000}
                            step={500}
                            unit="ms"
                            onChange={setSimulationSpeed}
                            disabled={!isSimulating}
                        />
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center">
                            <Activity size={12} className="mr-1" />
                            Simulates the refresh rate of the IEC 63345 H1 interface.
                        </p>
                    </div>

                    {/* Reset & Maintenance */}
                    <div className="pt-6 border-t border-slate-100 dark:border-slate-700 space-y-3">
                        <button
                            onClick={() => { clearEventLog(); showToast("Logs Cleared", "success"); }}
                            className="w-full flex items-center justify-center px-4 py-3 bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-medium transition-colors"
                        >
                            <Trash size={18} className="mr-2" />
                            Clear Event Log
                        </button>
                        
                        <button
                            onClick={() => { refreshData(); onClose(); }}
                            className="w-full flex items-center justify-center px-4 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-medium transition-colors"
                        >
                            <RefreshCw size={18} className="mr-2" />
                            Reset All Meter Data
                        </button>
                    </div>

                    <div className="flex items-center justify-center pt-2 text-xs text-slate-400">
                        <Zap size={12} className="mr-1" />
                        IEC 63345 Compliant Implementation
                    </div>
                </div>
            )}
        </Modal>
    );
};
