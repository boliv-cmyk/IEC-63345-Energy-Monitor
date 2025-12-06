
import React from 'react';
import { 
    ResponsiveContainer, 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip,
    Legend
} from 'recharts';
import { DPT_MeteringValue } from '../../iec-types/dpt-metering-value';
import { DPT_DateTime } from '../../iec-types/dpt-datetime';
import { formatDPTDateTime } from '../../utils/formatters/formatDPTDateTime';
import { useMDC } from '../../context/MDCContext';
import { Spinner } from '../ui/Spinner';

interface Props {
    series1?: DPT_MeteringValue[];
    name1?: string;
    color1?: string;
    
    series2?: DPT_MeteringValue[];
    name2?: string;
    color2?: string;

    dates?: DPT_DateTime[];
    title?: string;
    height?: number;
    loading?: boolean;
}

export const HistoryLineChart: React.FC<Props> = ({ 
    series1, 
    name1 = "Series 1",
    color1 = "#3b82f6",
    series2, 
    name2 = "Series 2",
    color2 = "#f59e0b",
    dates, 
    title,
    height = 200,
    loading = false
}) => {
    const { darkMode } = useMDC();

    // Render Logic
    const hasData = series1 && dates && series1.length > 0 && dates.length > 0;

    // Theme Variables
    const gridColor = darkMode ? "#334155" : "#e2e8f0"; 
    const textColor = darkMode ? "#94a3b8" : "#64748b"; 
    const tooltipBg = darkMode ? '#1e293b' : '#ffffff';
    const tooltipColor = darkMode ? '#f8fafc' : '#0f172a';

    const data = hasData ? series1?.map((val, idx) => ({
        date: dates[idx] ? formatDPTDateTime(dates[idx]).split(' ')[0] : `Idx ${idx}`,
        val1: val.value,
        val2: series2 ? series2[idx]?.value : null,
        unit: val.unit
    })).reverse() : [];

    return (
        <div className="w-full relative">
            {title && <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">{title}</h4>}
            
            <div style={{ height, width: '100%' }} className="relative bg-slate-50/50 dark:bg-slate-900/50 rounded-lg">
                {loading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-[1px] rounded-lg">
                        <Spinner size={32} />
                    </div>
                )}

                {!hasData && !loading ? (
                    <div className="flex items-center justify-center h-full border border-slate-100 dark:border-slate-800 border-dashed rounded-lg">
                        <span className="text-slate-400 text-sm">No Trend Data Available</span>
                    </div>
                ) : (
                    <ResponsiveContainer>
                        <LineChart data={data}>
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
                                    backgroundColor: tooltipBg,
                                    color: tooltipColor
                                }}
                                formatter={(value: number, name: string, props: any) => [value.toLocaleString(), props.payload.unit]}
                            />
                            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                            <Line 
                                type="monotone" 
                                dataKey="val1" 
                                name={name1} 
                                stroke={color1} 
                                strokeWidth={2}
                                dot={{ r: 3, fill: color1 }}
                                activeDot={{ r: 5 }}
                            />
                            {series2 && (
                                <Line 
                                    type="monotone" 
                                    dataKey="val2" 
                                    name={name2} 
                                    stroke={color2} 
                                    strokeWidth={2}
                                    dot={{ r: 3, fill: color2 }}
                                    activeDot={{ r: 5 }}
                                />
                            )}
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};
