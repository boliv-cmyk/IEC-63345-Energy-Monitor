
import React, { useEffect, useState } from 'react';

interface Props {
    lastUpdated: Date;
}

export const DataFreshness: React.FC<Props> = ({ lastUpdated }) => {
    const [flash, setFlash] = useState(false);

    useEffect(() => {
        setFlash(true);
        const timer = setTimeout(() => setFlash(false), 1000);
        return () => clearTimeout(timer);
    }, [lastUpdated]);

    return (
        <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
            <div className="relative flex h-2 w-2">
                {flash && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${flash ? 'bg-green-400' : 'bg-green-600/50'}`}></span>
            </div>
            <span className="text-[10px] font-medium text-blue-100 font-mono tracking-wide">
                H1 LINK ACTIVE
            </span>
        </div>
    );
};
