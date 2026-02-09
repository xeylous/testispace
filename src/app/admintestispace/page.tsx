'use client';

import { useEffect, useState } from 'react';
import { Users, LayoutGrid, MessageSquare, TrendingUp } from 'lucide-react';

interface Stats {
    totalUsers: number;
    totalSpaces: number;
    totalTestimonials: number;
}

interface RecentUser {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
    plan: string;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/admin/stats');
                const data = await res.json();
                if (data.stats) {
                    setStats(data.stats);
                    setRecentUsers(data.recentUsers || []);
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-full">Loading stats...</div>;
    }

    return (
        <div>
            <h2 className="text-3xl font-bold mb-8">Dashboard Overview</h2>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <StatsCard 
                    title="Total Users" 
                    value={stats?.totalUsers || 0} 
                    icon={<Users className="w-6 h-6 text-blue-500" />}
                    trend="+12% from last month"
                />
                <StatsCard 
                    title="Active Spaces" 
                    value={stats?.totalSpaces || 0} 
                    icon={<LayoutGrid className="w-6 h-6 text-purple-500" />}
                    trend="+5% from last month"
                />
                <StatsCard 
                    title="Testimonials Collected" 
                    value={stats?.totalTestimonials || 0} 
                    icon={<MessageSquare className="w-6 h-6 text-green-500" />}
                    trend="+28% from last month"
                />
            </div>

            {/* Recent Signups */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-6 border-b border-border flex justify-between items-center">
                    <h3 className="font-semibold text-lg">Recent Signups</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4 font-medium">User</th>
                                <th className="px-6 py-4 font-medium">Plan</th>
                                <th className="px-6 py-4 font-medium">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {recentUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-muted/30">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="font-medium">{user.name}</div>
                                            <div className="text-muted-foreground text-xs">{user.email}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            user.plan === 'pro' ? 'bg-purple-500/10 text-purple-500' : 
                                            user.plan === 'business' ? 'bg-blue-500/10 text-blue-500' : 
                                            'bg-gray-500/10 text-gray-500'
                                        }`}>
                                            {user.plan.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon, trend }: { title: string, value: number, icon: React.ReactNode, trend: string }) {
    return (
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-muted-foreground text-sm font-medium mb-1">{title}</h3>
                    <div className="text-3xl font-bold">{value}</div>
                </div>
                <div className="p-2 bg-muted/50 rounded-lg">
                    {icon}
                </div>
            </div>
            <div className="flex items-center text-xs text-green-500 gap-1">
                <TrendingUp size={14} />
                <span>{trend}</span>
            </div>
        </div>
    );
}
