
import React, { useState, useEffect, useRef } from 'react';
import { Lock, Unlock } from 'lucide-react';

interface Props {
    timeoutMinutes?: number;
}

export const SessionTimeout: React.FC<Props> = ({ timeoutMinutes = 5 }) => {
    const [isIdle, setIsIdle] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const timeoutMs = timeoutMinutes * 60 * 1000;

    const resetTimer = () => {
        if (isIdle) return; // Don't auto-unlock just by movement if already locked
        if (timerRef.current) clearTimeout(timerRef.current);
        
        timerRef.current = setTimeout(() => {
            setIsIdle(true);
        }, timeoutMs);
    };

    useEffect(() => {
        const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
        
        events.forEach(event => window.addEventListener(event, resetTimer));
        resetTimer(); // Start initial timer

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            events.forEach(event => window.removeEventListener(event, resetTimer));
        };
    }, [isIdle]);

    const unlock = () => {
        setIsIdle(false);
        resetTimer();
    };

    if (!isIdle) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center text-white animate-in fade-in duration-700">
            <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm w-full mx-4 border border-slate-700">
                <div className="bg-slate-700 p-4 rounded-full mb-6 ring-4 ring-slate-600">
                    <Lock size={48} className="text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Display Locked</h2>
                <p className="text-slate-400 text-center mb-8 text-sm">
                    Session timed out due to inactivity. <br/>
                    Please touch to resume monitoring.
                </p>
                <button
                    onClick={unlock}
                    className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition-all flex items-center justify-center group"
                >
                    <Unlock size={20} className="mr-2 group-hover:rotate-12 transition-transform" />
                    Resume Session
                </button>
                <div className="mt-6 text-xs text-slate-600 font-mono">
                    IEC 63345 SECD • SECURE MODE
                </div>
            </div>
        </div>
    );
};
