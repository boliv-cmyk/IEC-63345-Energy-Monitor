
import React from 'react';
import { useMDC } from '../../context/MDCContext';
import { SignalBars } from './SignalBars';
import { Server, Wifi, WifiOff } from 'lucide-react';

export const ConnectionStatus: React.FC = () => {
    const { simulateNetworkLatency, connectionQuality, darkMode } = useMDC();

    // Determine status text/color
    let statusText = "Excellent";
    let statusColor = darkMode ? "text-green-400" : "text-green-600";
    
    if (simulateNetworkLatency) {
        if (connectionQuality < 50) {
            statusText = "Poor / Unstable";
            statusColor = darkMode ? "text-red-400" : "text-red-600";
        } else {
            statusText = "Degraded (Latency)";
            statusColor = darkMode ? "text-yellow-400" : "text-yellow-600";
        }
    }

    return (
        <div className={`flex items-center px-4 py-3 rounded-lg border ${darkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'} shadow-sm transition-colors`}>
            <div className="relative mr-3 flex-shrink-0">
                <div className={`p-2 rounded-full ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    {connectionQuality === 0 ? (
                        <WifiOff size={16} className="text-slate-400" />
                    ) : (
                        <Server size={16} className={darkMode ? 'text-slate-300' : 'text-slate-600'} />
                    )}
                </div>
                {connectionQuality > 0 && (
                    <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 ${darkMode ? 'border-slate-800' : 'border-white'} ${simulateNetworkLatency ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></span>
                )}
            </div>
            
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>H1 Interface</span>
                    <SignalBars quality={connectionQuality} />
                </div>
                <div className={`text-xs font-medium truncate ${statusColor}`}>
                    {statusText}
                </div>
            </div>
        </div>
    );
};
