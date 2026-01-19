"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";
import { LogOut, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="relative z-20 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-border/40 backdrop-blur-md bg-background/50 sticky top-0">
        <div className="flex items-center gap-2">
            <Link href="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
                TestiSpace
            </Link>
        </div>
        <div className="flex items-center gap-4">
            <ThemeToggle />
            {status === "loading" ? (
              <div className="w-20 h-8 bg-muted animate-pulse rounded-full" />
            ) : session ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <span className="text-sm text-muted-foreground hidden sm:block">
                  {session.user?.email}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2 bg-destructive/10 hover:bg-destructive/20 text-destructive px-3 py-2 rounded-full text-sm font-medium transition-all"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
        </div>
    </nav>
  );
}

