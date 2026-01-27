"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalyticsCharts({ data }: { data: any[] }) {
    return (
        <div className="glass-card p-6 rounded-xl border border-border h-[400px]">
            <h3 className="text-lg font-bold mb-6">Views & Engagement</h3>
            <ResponsiveContainer width="100%" height="85%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#33333333" vertical={false} />
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#888888', fontSize: 12 }} 
                        dy={10}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#888888', fontSize: 12 }} 
                    />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1e1b4b', borderColor: '#334155', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="views" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorViews)" 
                    />
                    <Area 
                        type="monotone" 
                        dataKey="clicks" 
                        stroke="#8b5cf6" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorClicks)" 
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
