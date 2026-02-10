"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import { LogOut, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 backdrop-blur-md bg-background/90 supports-[backdrop-filter]:bg-background/60 font-sans transition-all duration-300">
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center gap-8">
                <Link href="/" className="flex items-center gap-2 group">
                    <span className="text-xl font-bold text-primary hover:opacity-90 transition-opacity">TestiSpace</span>
                </Link>
                
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-2" onMouseLeave={() => setHoveredPath(null)}>
                    {['Features', 'Pricing', 'Docs', 'Blog'].map((item) => {
                        const href = item === 'Blog' ? 'https://blog.xeylous.xyz' : `/${item.toLowerCase()}`;
                        const isActive = pathname === href;
                        const isHovered = hoveredPath === href;
                        
                        return (
                            <Link 
                                key={item} 
                                href={href}
                                target={item === 'Blog' ? "_blank" : undefined}
                                className={`text-[13px] font-medium transition-colors relative px-3 py-2 rounded-full ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                                onMouseEnter={() => setHoveredPath(href)}
                            >
                                <span className="relative z-10">{item}</span>
                                {isHovered && (
                                    <motion.div
                                        layoutId="navbar-hover"
                                        className="absolute inset-0 bg-muted/80 rounded-full z-0"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                {isActive && (
                                    <motion.span
                                        layoutId="navbar-underline"
                                        className="absolute left-3 right-3 -bottom-1 h-[2px] bg-primary rounded-full z-20"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
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
                      className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
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

