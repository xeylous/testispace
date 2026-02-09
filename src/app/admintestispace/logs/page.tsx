'use client';

import { useEffect, useState } from 'react';
import { Search, Loader2, Clock, Shield, User, Globe } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Log {
    _id: string;
    action: string;
    user?: {
        name: string;
        email: string;
        image?: string;
    };
    details?: any;
    ip?: string;
    createdAt: string;
}

export default function LogsPage() {
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/logs?page=${page}`);
            const data = await res.json();
            if (data.logs) {
                setLogs(data.logs);
                setTotalPages(data.totalPages);
            }
        } catch (error) {
            console.error('Failed to fetch logs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [page]);

    const getActionColor = (action: string) => {
        if (action.includes('LOGIN')) return 'text-green-500 bg-green-500/10';
        if (action.includes('UPDATE')) return 'text-blue-500 bg-blue-500/10';
        if (action.includes('REGISTER')) return 'text-purple-500 bg-purple-500/10';
        if (action.includes('DELETE')) return 'text-red-500 bg-red-500/10';
        return 'text-muted-foreground bg-secondary';
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">System Logs</h1>
                    <p className="text-muted-foreground">Monitor real-time system activity and security events.</p>
                </div>
                <button 
                    onClick={fetchLogs} 
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title="Refresh Logs"
                >
                    <Clock className="w-5 h-5 text-muted-foreground" />
                </button>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4 font-medium">Action</th>
                                <th className="px-6 py-4 font-medium">User</th>
                                <th className="px-6 py-4 font-medium">Details</th>
                                <th className="px-6 py-4 font-medium">IP Address</th>
                                <th className="px-6 py-4 font-medium text-right">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                                        Loading activity...
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                        No logs found.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log._id} className="hover:bg-muted/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getActionColor(log.action)}`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {log.user ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] text-primary font-bold">
                                                        {log.user.name?.[0]?.toUpperCase() || 'U'}
                                                    </div>
                                                    <div className="max-w-[150px] truncate" title={log.user.email}>
                                                        {log.user.email}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground italic">System / Guest</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="max-w-[300px] truncate font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                                                {JSON.stringify(log.details)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Globe className="w-3 h-3" />
                                                {log.ip || 'Unknown'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-muted-foreground whitespace-nowrap">
                                            {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                <div className="p-4 border-t border-border flex justify-between items-center text-sm text-muted-foreground">
                    <div>Page {page} of {totalPages}</div>
                    <div className="flex gap-2">
                        <button 
                            className="px-3 py-1 border border-border rounded hover:bg-muted disabled:opacity-50"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1 || loading}
                        >
                            Previous
                        </button>
                        <button 
                            className="px-3 py-1 border border-border rounded hover:bg-muted disabled:opacity-50"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages || loading}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
