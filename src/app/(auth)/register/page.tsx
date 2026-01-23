"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [step, setStep] = useState<"register" | "otp">("register");
  
  // Register Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // OTP Form State
  const [otp, setOtp] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        if (res.ok) {
            setStep("otp");
        } else {
            const data = await res.json();
            setError(data.message || "Registration failed");
        }
    } catch (err) {
        setError("Something went wrong");
    } finally {
        setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      try {
          const res = await fetch("/api/verify-otp", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, otp }),
          });

          if (res.ok) {
              // Redirect to login or automatically sign in
              router.push("/login?verified=true");
          } else {
              const data = await res.json();
              setError(data.message || "Verification failed");
          }
      } catch (err) {
          setError("Something went wrong");
      } finally {
          setLoading(false);
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
          {step === "register" ? "Create Account" : "Verify Email"}
        </h1>
        <p className="text-muted-foreground mt-2">
            {step === "register" ? "Join TestiSpace today" : `Enter the OTP sent to ${email}`}
        </p>
      </div>

      {step === "register" ? (
          <form onSubmit={handleRegister} className="space-y-4">
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-ring outline-none transition-all text-foreground"
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
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-ring outline-none transition-all text-foreground"
                  placeholder="you@example.com"
                  required
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-input border border-border rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-ring outline-none transition-all text-foreground"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 rounded-lg transition-colors shadow-[0_0_15px_rgba(139,92,246,0.5)] disabled:opacity-50"
            >
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>
      ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <div>
                <label className="block text-sm font-medium mb-1">One-Time Password (OTP)</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-ring outline-none transition-all text-foreground text-center tracking-widest text-2xl"
                  placeholder="123456"
                  maxLength={6}
                  required
                />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 rounded-lg transition-colors shadow-[0_0_15px_rgba(139,92,246,0.5)] disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button
                type="button"
                onClick={() => setStep("register")}
                className="w-full text-sm text-muted-foreground hover:text-white transition-colors"
            >
                Start Over
            </button>
          </form>
      )}

      {step === "register" && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-accent hover:underline">
              Sign In
            </Link>
          </p>
      )}
    </motion.div>
  );
}
