
import React from 'react';
import { useMDC } from '../context/MDCContext';
import { Activity } from 'lucide-react';
import { DataFreshness } from './ui/DataFreshness';
import { MeterSummaryCard } from './MeterSummaryCard';
import { Skeleton } from './ui/Skeleton';
import { EventLog } from './EventLog';

interface Props {
  onSelectMeter: (id: string) => void;
}

const DashboardOverview: React.FC<Props> = ({ onSelectMeter }) => {
  const { meters, lastUpdated } = useMDC();

  if (meters.length === 0) {
    return (
      <div className="space-y-6">
         <div className="h-40 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 rounded-2xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Activity size={180} />
        </div>
        <div className="relative z-10 mb-4 md:mb-0">
            <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">Energy Efficiency System</h2>
                <DataFreshness lastUpdated={lastUpdated} />
            </div>
            <p className="text-blue-100 max-w-xl text-sm lg:text-base leading-relaxed opacity-90">
                IEC 63345:2023 Compliant SECD. Monitoring {meters.length} functional blocks via H1 interface simulation.
            </p>
        </div>
      </div>

      {/* Grid of Meters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {meters.map(meter => (
            <MeterSummaryCard 
                key={meter._internalId} 
                meter={meter} 
                onClick={onSelectMeter} 
            />
        ))}
      </div>

      {/* Event Log Section */}
      <div className="pt-4">
          <EventLog />
      </div>
    </div>
  );
};

export default DashboardOverview;
