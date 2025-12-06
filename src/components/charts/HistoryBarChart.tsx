
import React from 'react';
import { 
    ResponsiveContainer, 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip,
} from 'recharts';
import { DPT_MeteringValue } from '../../iec-types/dpt-metering-value';
import { DPT_DateTime } from '../../iec-types/dpt-datetime';
import { formatDPTDateTime } from '../../utils/formatters/formatDPTDateTime';
import { Download } from 'lucide-react';
import { exportHistoryToCSV } from '../../utils/export/exportHistory';
import { useMDC } from '../../context/MDCContext';
import { Spinner } from '../ui/Spinner';

interface Props {
    dataValues?: DPT_MeteringValue[];
    dates?: DPT_DateTime[];
    title?: string;
    color?: string;
    height?: number;
    exportName?: string;
    loading?: boolean;
}

export const HistoryBarChart: React.FC<Props> = ({ 
    dataValues, 
    dates, 
    title = "History", 
    color = "#3b82f6",
    height = 200,
    exportName = "meter_data",
    loading = false
}) => {
    const { darkMode } = useMDC();

    const handleExport = () => {
        if (dataValues && dates) {
            exportHistoryToCSV(dataValues, dates, exportName);
        }
    };

    // Render Logic
    const hasData = dataValues && dates && dataValues.length > 0 && dates.length > 0;

    // Theme Variables
    const gridColor = darkMode ? "#334155" : "#e2e8f0"; // slate-700 vs slate-200
    const textColor = darkMode ? "#94a3b8" : "#64748b"; // slate-400 vs slate-500
    const cursorFill = darkMode ? "#1e293b" : "#f1f5f9"; // slate-800 vs slate-100

    return (
        <div className="w-full relative">
            <div className="flex justify-between items-center mb-2">
                {title && <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{title}</h4>}
                <button 
                    onClick={handleExport}
                    disabled={!hasData || loading}
                    className="flex items-center text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Export as CSV"
                >
                    <Download size={14} className="mr-1" />
                    CSV
                </button>
            </div>
            
            <div style={{ height, width: '100%' }} className="relative bg-slate-50/50 dark:bg-slate-900/50 rounded-lg">
                {loading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-[1px] rounded-lg">
                        <Spinner size={32} />
                    </div>
                )}

                {!hasData && !loading ? (
                    <div className="flex items-center justify-center h-full border border-slate-100 dark:border-slate-800 border-dashed rounded-lg">
                        <span className="text-slate-400 text-sm">No History Data Available</span>
                    </div>
                ) : (
                    <ResponsiveContainer>
                        <BarChart data={hasData ? dataValues.map((val, idx) => ({
                            date: dates[idx] ? formatDPTDateTime(dates[idx]).split(' ')[0] : `Idx ${idx}`,
                            value: val.value,
                            unit: val.unit
                        })).reverse() : []}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                            <XAxis 
                                dataKey="date" 
                                tick={{fontSize: 10, fill: textColor}} 
                                tickLine={false} 
                                axisLine={false}
                                interval="preserveStartEnd"
                            />
                            <YAxis 
                                tick={{fontSize: 10, fill: textColor}} 
                                tickLine={false} 
                                axisLine={false} 
                            />
                            <Tooltip 
                                contentStyle={{
                                    borderRadius: '8px', 
                                    border: 'none', 
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                                    color: darkMode ? '#f8fafc' : '#0f172a'
                                }}
                                cursor={{fill: cursorFill}}
                                formatter={(value: number, name: string, props: any) => [value.toLocaleString(), props.payload.unit]}
                            />
                            <Bar 
                                dataKey="value" 
                                fill={color} 
                                radius={[4, 4, 0, 0]} 
                                barSize={20}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};
