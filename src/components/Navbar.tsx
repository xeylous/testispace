"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";
import { LogOut, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 backdrop-blur-md bg-background/50 font-sans transition-all duration-300">
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center gap-8">
                <Link href="/" className="flex items-center gap-2 group">
                    <span className="text-xl font-bold text-primary hover:opacity-90 transition-opacity">TestiSpace</span>
                </Link>
                
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    <Link href="/features" className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Features
                    </Link>
                    <Link href="/pricing" className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Pricing
                    </Link>
                    <Link href="/docs" className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Docs
                    </Link>
                    <Link href="https://blog.xeylous.xyz" target="_blank" className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Blog
                    </Link>
                </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
                <div className="mr-2">
                   <ThemeToggle />
                </div>
                
                {status === "loading" ? (
                  <div className="w-20 h-8 bg-muted animate-pulse rounded-md" />
                ) : session ? (
                  <>
                    <Link 
                      href="/dashboard" 
                      className="hidden sm:flex items-center gap-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <LayoutDashboard size={14} />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                        href="/login" 
                        className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-[4px] text-[13px] font-medium transition-all shadow-sm"
                    >
                      Get Started
                    </Link>
                  </>
                )}
            </div>
        </div>
    </nav>
  );
}

