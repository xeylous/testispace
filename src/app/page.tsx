"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, Shield, Zap } from "lucide-react";
import ThreeBackground from "@/components/ThreeBackground";

export default function Home() {
  return (
    <div className="relative min-h-screen text-white overflow-hidden selection:bg-primary selection:text-white">
      {/* Background */}
      <ThreeBackground />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          TestiSpace
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-white/80 transition-colors">
            Login
          </Link>
          <Link
            href="/register"
            className="bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-2 rounded-full text-sm font-medium transition-all backdrop-blur-md"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse"></span>
            <span className="text-xs font-medium text-accent">v1.0 Public Beta</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-white via-white/80 to-white/40 bg-clip-text text-transparent">
            Collect Testimonials <br />
            <span className="text-stroke">From The Future</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            The all-in-one platform to collect, manage, and embed video & text testimonials. 
            Built for modern SaaS with a futuristic touch.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="group relative inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white text-lg font-semibold px-8 py-4 rounded-full transition-all shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:shadow-[0_0_30px_rgba(139,92,246,0.7)]"
            >
              Start for free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/demo" 
              className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white text-lg font-medium px-8 py-4 rounded-full border border-white/10 transition-all backdrop-blur-sm"
              onClick={(e) => { e.preventDefault(); alert("We are live! Sign up to try."); }} // Placeholder for demo
            >
              View Demo
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-32"
        >
            <FeatureCard 
                icon={<Star className="w-8 h-8 text-yellow-400" />}
                title="Collect & Embed"
                description="Gather video & text reviews and embed them on your site with a single line of code."
            />
            <FeatureCard 
                icon={<Shield className="w-8 h-8 text-primary" />}
                title="Moderation"
                description="Full control over what gets displayed. Approve, archive, or delete with ease."
            />
            <FeatureCard 
                icon={<Zap className="w-8 h-8 text-accent" />}
                title="Lightning Fast"
                description="Optimized with Redis caching and global CDN for zero layout shift."
            />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12 text-center text-sm text-muted-foreground">
        <p>© 2026 TestiSpace. Built for Hackathon.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="glass-card p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-colors text-left group">
            <div className="mb-4 p-3 bg-white/5 w-fit rounded-xl group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">
                {description}
            </p>
        </div>
    )
}
