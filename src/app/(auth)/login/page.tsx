"use client";
import { signIn } from "next-auth/react";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import TurnstileWidget from "@/components/TurnstileWidget";

function LoginForm() {
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  
  // Email State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Phone State
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [showOtpInput, setShowOtpInput] = useState(false);

  const [cfToken, setCfToken] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const verifiedParam = searchParams.get("verified");
  const [showVerifiedMessage, setShowVerifiedMessage] = useState(false);

  useEffect(() => {
    if (verifiedParam) {
        setShowVerifiedMessage(true);
        const timer = setTimeout(() => {
            setShowVerifiedMessage(false);
            // Optionally clean up URL
            router.replace("/login"); 
        }, 10000); // 10 seconds
        return () => clearTimeout(timer);
    }
  }, [verifiedParam, router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!cfToken) {
        setError("Please complete the CAPTCHA");
        setLoading(false);
        return;
    }

    const res = await signIn("credentials", {
      email,
      password,
      cfToken, 
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid credentials");
      setLoading(false);
    } else {
      window.location.href = "/dashboard";
    }
  };

  const handleSendOtp = async () => {
      if (!phone) {
          setError("Please enter phone number");
          return;
      }
      if (!phone.startsWith("+") || phone.length < 10) {
          setError("Please include country code! (e.g., +919876543210)");
          return;
      }
      
      setLoading(true);
      setError("");

      // Phone Auth is currently disabled (requires Firebase Blaze Plan)
      alert("We are working on this feature");
      setLoading(false);
  };

  const handleVerifyOtp = async () => {
      if (!otp || !confirmationResult) return;
      setLoading(true);
      setError("");

      try {
          // 1. Verify with Firebase
          const result = await confirmationResult.confirm(otp);
          const user = result.user;
          const idToken = await user.getIdToken();

          // 2. Sign in with NextAuth using custom credentials
          // We need to support this in [...nextauth]
          // For now, we will assume we pass the phone number to credentials provider
          // SECURITY NOTE: In production, verify idToken on server.
          
          const res = await signIn("credentials", {
              phone: phone,
              idToken: idToken, 
              redirect: false,
              isPhoneLogin: "true",
              cfToken
          });

          if (res?.error) {
              setError("Login failed: Phone number not found or registered.");
              setLoading(false);
          } else {
              window.location.href = "/dashboard";
          }

      } catch (err) {
          console.error(err);
          setError("Invalid OTP");
          setLoading(false);
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
          Welcome Back
        </h1>
        <p className="text-muted-foreground mt-2">Sign in to TestiSpace</p>
        
        {showVerifiedMessage && (
            <div className="mt-4 p-2 bg-green-500/10 text-green-500 rounded text-sm">
                Email verified! Please login.
            </div>
        )}
      </div>

      {/* Login Method Toggle */}
      <div className="flex p-1 bg-secondary/30 rounded-lg mb-6">
          <button
            onClick={() => { setLoginMethod("email"); setError(""); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                loginMethod === "email" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
              Email & Password
          </button>
          <button
            onClick={() => { setLoginMethod("phone"); setError(""); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                loginMethod === "phone" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
              Phone OTP
          </button>
      </div>

      {loginMethod === "email" ? (
          <form onSubmit={handleEmailLogin} className="space-y-4">
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
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError("");
                    }}
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
            <div className="flex justify-center mb-4">
                 <TurnstileWidget onVerify={(token) => { setCfToken(token); setError(""); }} />
            </div>
            <button
              type="submit"
              disabled={loading || !cfToken}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 rounded-lg transition-colors shadow-[0_0_15px_rgba(139,92,246,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
      ) : (
          <div className="space-y-4">
             {error && <p className="text-red-500 text-sm text-center">{error}</p>}
             
             {!showOtpInput ? (
                 <div>
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-input border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-ring outline-none transition-all text-foreground"
                      placeholder="+919876543210"
                    />
                    <div id="recaptcha-login-container" className="mt-2"></div>
                    <button
                        onClick={handleSendOtp}
                        disabled={loading || !phone}
                        className="w-full mt-4 bg-primary hover:bg-primary/90 text-white font-bold py-2 rounded-lg transition-colors shadow-[0_0_15px_rgba(139,92,246,0.5)] disabled:opacity-50"
                    >
                        {loading ? "Sending..." : "Send OTP"}
                    </button>
                 </div>
             ) : (
                 <div>
                    <label className="block text-sm font-medium mb-1">Enter OTP</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full bg-input border border-border rounded-lg px-4 py-2 text-center tracking-widest text-2xl mb-4"
                      placeholder="123456"
                    />
                    <div className="flex justify-center mb-4">
                        <TurnstileWidget onVerify={(token) => { setCfToken(token); setError(""); }} />
                    </div>
                    <button
                        onClick={handleVerifyOtp}
                        disabled={loading || !cfToken}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 rounded-lg transition-colors shadow-[0_0_15px_rgba(139,92,246,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Verifying..." : "Verify & Login"}
                    </button>
                    <button
                         onClick={() => setShowOtpInput(false)}
                         className="w-full mt-2 text-sm text-muted-foreground hover:text-white"
                     >
                         Change Phone Number
                     </button>
                 </div>
             )}
          </div>
      )}

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
          className="w-full glass hover:bg-white/10 p-2 rounded-lg flex items-center justify-center transition-colors border border-white/10 cursor-pointer"
        >
          Google
        </button>
        <button
          onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
          className="w-full glass hover:bg-white/10 p-2 rounded-lg flex items-center justify-center transition-colors border border-white/10 cursor-pointer"
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-[50vh] text-primary">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
