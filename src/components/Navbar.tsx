"use client";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <nav className="relative z-20 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-border/40 backdrop-blur-md bg-background/50 sticky top-0">
        <div className="flex items-center gap-2">
            <Link href="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
                TestiSpace
            </Link>
        </div>
        <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                Login
            </Link>
            <Link
                href="/register"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm"
            >
                Get Started
            </Link>
        </div>
    </nav>
  );
}
