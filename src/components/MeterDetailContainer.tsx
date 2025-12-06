
import React, { useState } from 'react';
import { useMDC } from '../context/MDCContext';
import { MeterDetailHeader } from './MeterDetailHeader';
import { MeterTechnicalView } from './MeterTechnicalView';
import { FB_ELECM } from './functional-blocks/FB_ELECM';
import { FB_GASM } from './functional-blocks/FB_GASM';
import { FB_HEATM } from './functional-blocks/FB_HEATM';
import { FB_WATERM } from './functional-blocks/FB_WATERM';
import { FB_HCA } from './functional-blocks/FB_HCA';
import { FB_BREAKERM } from './functional-blocks/FB_BREAKERM';
import { FB_VALVEM } from './functional-blocks/FB_VALVEM';
import { FB_GENERICM } from './functional-blocks/FB_GENERICM';
import { Activity, FileText } from 'lucide-react';
import { NotFound } from './ui/NotFound';

interface Props {
    meterId: string;
}

export const MeterDetailContainer: React.FC<Props> = ({ meterId }) => {
    const { meters } = useMDC();
    const [viewMode, setViewMode] = useState<'live' | 'technical'>('live');

    const meter = meters.find(m => m._internalId === meterId);

    if (!meter) {
        return (
            <NotFound 
                title="Meter Not Found"
                message={`The functional block with ID "${meterId}" is not present in the current simulation context.`}
                onBack={() => window.location.href = '/'} // Or handle via parent navigation
            />
        );
    }

    const renderFunctionalBlock = () => {
        switch (meter.type) {
            case 'M_ELECM': return <FB_ELECM meter={meter} />;
            case 'M_GASM': return <FB_GASM meter={meter} />;
            case 'M_HEATM': return <FB_HEATM meter={meter} />;
            case 'M_WATERM': return <FB_WATERM meter={meter} />;
            case 'M_HCA': return <FB_HCA meter={meter} />;
            case 'M_BREAKERM': return <FB_BREAKERM meter={meter} />;
            case 'M_VALVEM': return <FB_VALVEM meter={meter} />;
            case 'M_GENERICM': return <FB_GENERICM meter={meter} />;
            default: return <div>Unknown Meter Type</div>;
        }
    };

    return (
        <div className="animate-in fade-in duration-300">
            <MeterDetailHeader meter={meter} />

            <div className="flex space-x-2 mb-6 border-b border-slate-200 dark:border-slate-700">
                <button
                    onClick={() => setViewMode('live')}
                    className={`pb-2 px-4 text-sm font-medium transition-colors border-b-2 ${
                        viewMode === 'live' 
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' 
                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                >
                    <div className="flex items-center">
                        <Activity size={16} className="mr-2" />
                        Live Data
                    </div>
                </button>
                <button
                    onClick={() => setViewMode('technical')}
                    className={`pb-2 px-4 text-sm font-medium transition-colors border-b-2 ${
                        viewMode === 'technical' 
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' 
                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                >
                    <div className="flex items-center">
                        <FileText size={16} className="mr-2" />
                        Technical Spec
                    </div>
                </button>
            </div>

            <div className="min-h-[400px]">
                {viewMode === 'live' ? renderFunctionalBlock() : <MeterTechnicalView meter={meter} />}
            </div>
        </div>
    );
};
