'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Shield, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError('Invalid admin credentials');
                setLoading(false);
            } else {
                // Force redirect to admin dashboard
                router.push('/admintestispace');
                router.refresh();
            }
        } catch (err) {
            setError('Something went wrong');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
                        <Shield size={24} />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Admin Access</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Restricted area. Please sign in to continue.
                    </p>
                </div>

                <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg flex items-center gap-2">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}
                        
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                placeholder="name@company.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-muted-foreground mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                    Verifying...
                                </>
                            ) : (
                                'Sign in to Dashboard'
                            )}
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or sign in with</span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => signIn("google", { callbackUrl: "/admintestispace" })}
                            className="w-full bg-background border border-border hover:bg-muted p-2 rounded-lg flex items-center justify-center transition-colors shadow-sm"
                            type="button"
                        >
                            Google
                        </button>
                        <button
                            onClick={() => signIn("github", { callbackUrl: "/admintestispace" })}
                            className="w-full bg-background border border-border hover:bg-muted p-2 rounded-lg flex items-center justify-center transition-colors shadow-sm"
                            type="button"
                        >
                            GitHub
                        </button>
                    </div>
                </div>

                <div className="text-center text-sm">
                    <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                        ← Back to Website
                    </Link>
                </div>
            </div>
        </div>
    );
}
