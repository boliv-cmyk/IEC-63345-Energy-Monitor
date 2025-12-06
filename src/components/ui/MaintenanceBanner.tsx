
import React from 'react';
import { Wrench } from 'lucide-react';

export const MaintenanceBanner: React.FC = () => {
    return (
        <div className="bg-yellow-400 text-yellow-950 px-4 py-2 flex items-center justify-center text-sm font-bold shadow-md animate-in slide-in-from-top duration-300 print:hidden sticky top-0 z-50">
            <div className="flex items-center space-x-2">
                <Wrench size={18} className="animate-bounce" />
                <span className="uppercase tracking-wider">System in Maintenance Mode</span>
                <span className="hidden sm:inline font-normal opacity-80 text-xs ml-2">- Alarms Suppressed -</span>
            </div>
            {/* Striped Background Effect Overlay */}
            <div 
                className="absolute inset-0 opacity-10 pointer-events-none" 
                style={{
                    backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)',
                    backgroundSize: '20px 20px'
                }}
            />
        </div>
    );
};
