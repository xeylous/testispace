"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const res = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password }),
        });

        if (res.ok) {
            router.push("/login");
        } else {
            const data = await res.json();
            setError(data.message || "Registration failed");
        }
    } catch (err) {
        setError("Something went wrong");
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
          Create Account
        </h1>
        <p className="text-muted-foreground mt-2">Join TestiSpace today</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-input border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-ring outline-none transition-all text-white"
              placeholder="John Doe"
              required
            />
        </div>
        <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-input border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-ring outline-none transition-all text-white"
              required
            />
        </div>
        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 rounded-lg transition-colors shadow-[0_0_15px_rgba(139,92,246,0.5)]"
        >
          Sign Up
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-accent hover:underline">
          Sign In
        </Link>
      </p>
    </motion.div>
  );
}
