"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid credentials");
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 rounded-2xl shadow-xl border-border"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="text-muted-foreground mt-2">Sign in to TestiSpace</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              className="w-full bg-input border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-ring outline-none transition-all text-white"
              placeholder="you@example.com"
              required
            />
        </div>
        <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              className="w-full bg-input border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-ring outline-none transition-all text-white"
              required
            />
        </div>
        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 rounded-lg transition-colors shadow-[0_0_15px_rgba(139,92,246,0.5)]"
        >
          Sign In
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full glass hover:bg-white/10 p-2 rounded-lg flex items-center justify-center transition-colors border border-white/10"
        >
          Google
        </button>
        <button
          onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
          className="w-full glass hover:bg-white/10 p-2 rounded-lg flex items-center justify-center transition-colors border border-white/10"
        >
          GitHub
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-accent hover:underline">
          Sign up
        </Link>
      </p>
    </motion.div>
  );
}
