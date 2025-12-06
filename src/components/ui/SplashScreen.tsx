
import React, { useEffect, useState } from 'react';
import { Activity, Check, Terminal } from 'lucide-react';

interface Props {
    onComplete: () => void;
}

const steps = [
    "Initializing Boot Sequence...",
    "Verifying System RAM... OK",
    "Loading IEC 63345 Protocol Stack...",
    "Detecting Local Network Access Point (LNAP)...",
    "Initializing H1 Interface Driver...",
    "Checking Data Consistency... RxSequenceCounter Synced",
    "Starting Simple External Consumer Display (SECD)..."
];

export const SplashScreen: React.FC<Props> = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if (currentStep < steps.length) {
            const timeout = Math.random() * 400 + 200; // Random delay between 200-600ms
            const timer = setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, timeout);
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(onComplete, 800);
            return () => clearTimeout(timer);
        }
    }, [currentStep, onComplete]);

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900 text-slate-200 font-mono flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-md space-y-6">
                <div className="flex items-center justify-center mb-8 animate-pulse">
                    <Activity size={64} className="text-blue-500" />
                </div>
                
                <div className="space-y-2">
                    {steps.map((step, idx) => (
                        <div 
                            key={idx} 
                            className={`flex items-center text-sm transition-opacity duration-300 ${
                                idx > currentStep ? 'opacity-0' : 'opacity-100'
                            } ${idx === currentStep ? 'text-blue-400' : 'text-slate-400'}`}
                        >
                            <span className="mr-3 w-4">
                                {idx < currentStep ? <Check size={14} className="text-emerald-500" /> : <Terminal size={14} />}
                            </span>
                            {step}
                        </div>
                    ))}
                </div>

                <div className="h-1 w-full bg-slate-800 rounded-full mt-8 overflow-hidden">
                    <div 
                        className="h-full bg-blue-500 transition-all duration-300 ease-out"
                        style={{ width: `${Math.min(100, (currentStep / steps.length) * 100)}%` }}
                    />
                </div>
                
                <div className="text-center text-xs text-slate-600 mt-4">
                    IEC 63345 Consumer Display • Firmware v1.0.4
                </div>
            </div>
        </div>
    );
};
