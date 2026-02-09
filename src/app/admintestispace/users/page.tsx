'use client';

import { useEffect, useState } from 'react';
import { Search, Loader2, Check, X, Crown, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    plan: 'free' | 'pro' | 'business';
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [updating, setUpdating] = useState<string | null>(null);
    const router = useRouter();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/users?search=${search}&page=${page}`);
            const data = await res.json();
            if (data.users) {
                setUsers(data.users);
                setTotalPages(data.totalPages);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 500); // Debounce search
        return () => clearTimeout(timer);
    }, [search, page]);

    const [edits, setEdits] = useState<Record<string, Partial<User>>>({});

    const handleEdit = (id: string, field: keyof User, value: string) => {
        setEdits(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }));
    };

    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        userId: string;
        userName: string;
        field: 'role' | 'plan';
        currentValue: string;
        newValue: string;
    } | null>(null);

    const initiateUpdate = (userId: string, userName: string, field: 'role' | 'plan') => {
        const newValue = edits[userId]?.[field];
        const user = users.find(u => u._id === userId);
        if (!newValue || !user) return;

        setConfirmModal({
            isOpen: true,
            userId,
            userName,
            field,
            currentValue: user[field],
            newValue
        });
    };

    const confirmUpdate = async () => {
        if (!confirmModal) return;
        
        await saveUpdate(confirmModal.userId, confirmModal.field);
        setConfirmModal(null);
    };

    const saveUpdate = async (id: string, field: 'role' | 'plan') => {
        const value = edits[id]?.[field];
        if (!value) return;

        setUpdating(id);
        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [field]: value }),
            });
            
            if (res.ok) {
                const updatedUser = await res.json();
                setUsers(users.map(u => u._id === id ? { ...u, [field]: value } : u));
                
                // Clear the edit for this field
                setEdits(prev => {
                    const newEdits = { ...prev };
                    if (newEdits[id]) {
                        delete newEdits[id][field];
                        if (Object.keys(newEdits[id]!).length === 0) {
                            delete newEdits[id];
                        }
                    }
                    return newEdits;
                });
                
                router.refresh();
            }
        } catch (error) {
            console.error('Failed to update user:', error);
        } finally {
            setUpdating(null);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">User Management</h1>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Search users..." 
                        className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4 font-medium">User</th>
                                <th className="px-6 py-4 font-medium">Role</th>
                                <th className="px-6 py-4 font-medium">Plan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-muted-foreground">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                                        Loading users...
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-muted-foreground">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => {
                                    const pending = edits[user._id] || {};
                                    const roleChanged = pending.role && pending.role !== user.role;
                                    const planChanged = pending.plan && pending.plan !== user.plan;

                                    return (
                                        <tr key={user._id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                        {user.name?.[0]?.toUpperCase() || 'U'}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{user.name}</div>
                                                        <div className="text-muted-foreground text-xs">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {user.role === 'admin' && <Shield className="w-3 h-3 text-red-500" />}
                                                    <select 
                                                        className="bg-transparent border border-border rounded px-2 py-1 text-sm cursor-pointer focus:ring-2 focus:ring-primary/20"
                                                        value={pending.role || user.role}
                                                        onChange={(e) => handleEdit(user._id, 'role', e.target.value)}
                                                        disabled={updating === user._id}
                                                    >
                                                        <option value="user">User</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                    {roleChanged && (
                                                        <button 
                                                            onClick={() => initiateUpdate(user._id, user.name, 'role')}
                                                            className="px-3 py-1 bg-primary text-primary-foreground text-xs rounded shadow-sm hover:bg-primary/90 transition-colors"
                                                        >
                                                            Update
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {user.plan === 'pro' || user.plan === 'business' ? <Crown className="w-3 h-3 text-yellow-500" /> : null}
                                                    <select 
                                                        className={`bg-transparent border border-border rounded px-2 py-1 text-sm cursor-pointer focus:ring-2 focus:ring-primary/20 font-medium ${
                                                            (pending.plan || user.plan) === 'pro' ? 'text-purple-500' : 
                                                            (pending.plan || user.plan) === 'business' ? 'text-blue-500' : 
                                                            'text-muted-foreground'
                                                        }`}
                                                        value={pending.plan || user.plan}
                                                        onChange={(e) => handleEdit(user._id, 'plan', e.target.value)}
                                                        disabled={updating === user._id}
                                                    >
                                                        <option value="free">Free</option>
                                                        <option value="pro">Pro</option>
                                                        <option value="business">Business</option>
                                                    </select>
                                                    {planChanged && (
                                                        <button 
                                                            onClick={() => initiateUpdate(user._id, user.name, 'plan')}
                                                            className="px-3 py-1 bg-primary text-primary-foreground text-xs rounded shadow-sm hover:bg-primary/90 transition-colors"
                                                        >
                                                            Update
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
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

            {/* Confirmation Modal */}
            {confirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-card border border-border rounded-xl shadow-lg p-6 max-w-sm w-full mx-4 animate-in fade-in zoom-in duration-200">
                        <h2 className="text-lg font-bold mb-2">Confirm Update</h2>
                        <p className="text-muted-foreground mb-6">
                            Are you sure you want to change <strong>{confirmModal.userName}'s</strong> {confirmModal.field} from <span className="text-red-500">{confirmModal.currentValue}</span> to <span className="text-green-500 font-bold">{confirmModal.newValue}</span>?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => setConfirmModal(null)}
                                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmUpdate}
                                className="px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition-colors"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
