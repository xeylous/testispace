'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (timer > 0) return;

        setStatus('loading');
        setMessage('');

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.toLowerCase() }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage(data.message || 'Reset link sent to your email.');
                setTimer(30); // Start 30s resend timer
            } else {
                setStatus('error');
                setMessage(data.error || 'Something went wrong.');
            }
        } catch (error) {
            setStatus('error');
            setMessage('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 rounded-2xl shadow-xl border-border w-full max-w-md mx-auto"
        >
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Forgot Password?
                </h1>
                <p className="text-muted-foreground mt-2">
                    Enter your email to receive a reset link
                </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1 text-foreground">
                        Email Address
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="w-full bg-input border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-ring outline-none transition-all text-foreground"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                {message && (
                    <div className={`text-sm text-center p-3 rounded ${status === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {message}
                        {status === 'error' && message.includes('Email not found') && (
                            <div className="mt-2 text-xs">
                                <Link href="/register" className="text-accent underline font-semibold">Sign up</Link> or check your spelling.
                            </div>
                        )}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={status === 'loading' || timer > 0}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 rounded-lg transition-colors shadow-[0_0_15px_rgba(139,92,246,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {status === 'loading' ? 'Sending link...' : timer > 0 ? `Resend in ${timer}s` : 'Send Reset Link'}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
                Remember your password?{' '}
                <Link href="/login" className="text-accent hover:underline">
                    Back to Login
                </Link>
            </div>
        </motion.div>
    );
}
