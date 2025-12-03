import React, { useState, useEffect } from 'react';
import { getMockMeters } from './services/mockData';
import { MeterData, MeteringDeviceType } from './types';
import { LayoutDashboard, Zap, Flame, Droplets, Thermometer, Settings, Menu, X, Info, Power, Shield, Sliders } from 'lucide-react';
import DashboardOverview from './components/DashboardOverview';
import MeterDetail from './components/MeterDetail';

const App: React.FC = () => {
  const [meters, setMeters] = useState<MeterData[]>([]);
  const [selectedMeterId, setSelectedMeterId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Load mock data on mount
    const data = getMockMeters();
    setMeters(data);
    
    // Check screen size
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const selectedMeter = meters.find(m => m.id === selectedMeterId);

  const getIcon = (type: MeteringDeviceType) => {
    switch (type) {
      case MeteringDeviceType.Electricity: return <Zap size={18} />;
      case MeteringDeviceType.Gas: return <Flame size={18} />;
      case MeteringDeviceType.Heat: return <Thermometer size={18} />;
      case MeteringDeviceType.Water: return <Droplets size={18} />;
      case MeteringDeviceType.Breaker: return <Power size={18} />;
      case MeteringDeviceType.Valve: return <Shield size={18} />;
      case MeteringDeviceType.HeatCostAllocator: return <Sliders size={18} />;
      default: return <Info size={18} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:border-none lg:overflow-hidden'}
          lg:w-64 lg:block flex flex-col
        `}
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
            <LayoutDashboard className="text-white" size={20} />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-800">EcoMonitor</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Overview
          </div>
          <button
            onClick={() => { setSelectedMeterId(null); if(isMobile) setIsSidebarOpen(false); }}
            className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-colors ${
              selectedMeterId === null 
                ? 'text-blue-600 bg-blue-50 border-r-2 border-blue-600' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard size={18} className="mr-3" />
            Dashboard
          </button>

          <div className="px-4 mt-6 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Connected Meters
          </div>
          {meters.map(meter => (
            <button
              key={meter.id}
              onClick={() => { setSelectedMeterId(meter.id); if(isMobile) setIsSidebarOpen(false); }}
              className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                selectedMeterId === meter.id 
                  ? 'text-blue-600 bg-blue-50 border-r-2 border-blue-600' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className={`mr-3 ${selectedMeterId === meter.id ? 'text-blue-600' : 'text-slate-400'}`}>
                {getIcon(meter.MeteringDeviceType)}
              </span>
              <div className="flex flex-col items-start">
                <span className="truncate max-w-[120px]">{meter.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">{meter.type}</span>
              </div>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button className="flex items-center w-full px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-md transition-colors">
            <Settings size={18} className="mr-3" />
            System Settings
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50/50">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-xl font-semibold text-slate-800 ml-2 lg:ml-0">
              {selectedMeter ? selectedMeter.name : 'System Overview'}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
             <div className="hidden sm:flex items-center text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                IEC 63345 Compliant
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {selectedMeterId === null ? (
              <DashboardOverview meters={meters} onSelectMeter={setSelectedMeterId} />
            ) : selectedMeter ? (
              <MeterDetail meter={selectedMeter} />
            ) : (
              <div className="text-center py-20 text-slate-400">Meter not found</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
