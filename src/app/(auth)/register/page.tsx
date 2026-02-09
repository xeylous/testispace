"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import TurnstileWidget from "@/components/TurnstileWidget";

export default function RegisterPage() {
  const [step, setStep] = useState<"register" | "otp">("register");
  
  // Register Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  
  // Phone OTP State
  const [phoneOtp, setPhoneOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [showPhoneOtpInput, setShowPhoneOtpInput] = useState(false);

  // Email OTP
  const [otp, setOtp] = useState("");
  const [cfToken, setCfToken] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendPhoneOtp = async () => {
    if (!phone) {
        setError("Please enter a phone number");
        return;
    }
    // Basic E.164 format check validation
    if (!phone.startsWith("+") || phone.length < 10) {
        setError("Please include country code! (e.g., +919876543210)");
        return;
    }
    setError("");
    setLoading(true);

    // Phone Auth is currently disabled (requires Firebase Blaze Plan)
    alert("We are working on this feature");
    setLoading(false);
  };

  const handleVerifyPhoneOtp = async () => {
      if (!confirmationResult || !phoneOtp) return;
      setLoading(true);
      try {
          await confirmationResult.confirm(phoneOtp);
          setIsPhoneVerified(true);
          setShowPhoneOtpInput(false);
          setError("");
      } catch (err) {
          setError("Invalid Phone OTP");
      } finally {
          setLoading(false);
      }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only enforce verification if a phone number is provided
    if (phone && !isPhoneVerified) {
        setError("Please verify your phone number first");
        return;
    }

    setLoading(true);
    setError("");

    if (!cfToken) {
        setError("Please complete the CAPTCHA");
        setLoading(false);
        return;
    }

    try {
        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                name, 
                email, 
                password,
                phone,
                isPhoneVerified: true,
                cfToken
            }),
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
              body: JSON.stringify({                                
                  email, 
                  otp,
                  // Pass phone details if verified during this session
                  // However, API expects them to be in Redis from register step
                  // So we typically don't need to send them again here unless API changes
               }),
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

            {/* Phone Field */}
            <div>
                <label className="block text-sm font-medium mb-1">Phone Number <span className="text-muted-foreground text-xs">(Optional)</span></label>
                <div className="flex gap-2">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={isPhoneVerified || showPhoneOtpInput}
                      className="flex-1 bg-input border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-ring outline-none transition-all text-foreground"
                      placeholder="+919876543210"
                    />
                    {!isPhoneVerified && !showPhoneOtpInput && (
                        <button
                            type="button"
                            onClick={handleSendPhoneOtp}
                            disabled={loading || !phone}
                            className="bg-secondary hover:bg-secondary/80 text-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                        >
                            Verify
                        </button>
                    )}
                    {isPhoneVerified && (
                        <span className="flex items-center text-green-500 px-3 bg-green-500/10 rounded-lg text-sm font-medium">
                            Verified
                        </span>
                    )}
                </div>
                <div id="recaptcha-container"></div>
            </div>

            {/* Phone OTP Input */}
            {showPhoneOtpInput && (
                 <div className="mt-2 p-4 bg-secondary/10 rounded-lg border border-border">
                    <label className="block text-sm font-medium mb-1">Enter Phone OTP</label>
                    <div className="flex gap-2">
                        <input
                          type="text"
                          value={phoneOtp}
                          onChange={(e) => setPhoneOtp(e.target.value)}
                          className="flex-1 bg-input border border-border rounded-lg px-4 py-2 text-foreground"
                          placeholder="123456"
                        />
                        <button
                            type="button"
                            onClick={handleVerifyPhoneOtp}
                            disabled={loading}
                            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium"
                        >
                            Confirm
                        </button>
                    </div>
                 </div>
            )}

            <div className="flex justify-center mt-4 mb-4">
                 <TurnstileWidget onVerify={(token) => { setCfToken(token); setError(""); }} />
            </div>

            <button
              type="submit"
              disabled={loading || !cfToken}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 rounded-lg transition-colors shadow-[0_0_15px_rgba(139,92,246,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
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
