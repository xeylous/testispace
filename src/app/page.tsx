"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, Shield, Zap } from "lucide-react";
import ThreeBackground from "@/components/ThreeBackground";

export default function Home() {
  return (
    <div className="relative min-h-screen text-foreground overflow-hidden selection:bg-primary selection:text-white">
      {/* Background */}
      <ThreeBackground />

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
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-foreground">
            Collect Testimonials <br />
            <span className="text-primary">From The Future</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            The all-in-one platform to collect, manage, and embed video & text testimonials. 
            Built for modern SaaS with a futuristic touch.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="group relative inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold px-8 py-4 rounded-full transition-all shadow-[0_0_20px_rgba(156,171,132,0.5)] hover:shadow-[0_0_30px_rgba(156,171,132,0.7)]"
            >
              Start for free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/demo" 
              className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-foreground text-lg font-medium px-8 py-4 rounded-full border border-border transition-all backdrop-blur-sm"
              onClick={(e) => { e.preventDefault(); alert("We are live! Sign up to try."); }} // Placeholder for demo
            >
              View Demo
            </Link>
          </div>
        </motion.div>

        {/* Features Bento Grid */}
        <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
        >
            <FeatureBento />
        </motion.div>
      </main>
    </div>
  );
}

function FeatureBento() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 max-w-5xl mx-auto mt-32 h-[600px]">
            {/* Main Feature - Large */}
            <motion.div 
                whileHover={{ scale: 1.01 }}
                className="md:col-span-2 md:row-span-2 rounded-[2rem] bg-secondary/30 border border-border p-8 flex flex-col justify-between overflow-hidden relative"
            >
                <div className="relative z-10">
                    <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-primary">
                        <Star size={24} fill="currentColor" />
                    </div>
                    <h3 className="text-3xl font-bold mb-2 text-foreground">Collect & Embed</h3>
                    <p className="text-muted-foreground">The easiest way to gather video and text testimonials. Copy a single line of code to showcase social proof anywhere.</p>
                </div>
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
                
                {/* Visual Mockup */}
                <div className="mt-8 bg-white/50 backdrop-blur rounded-xl p-4 border border-white/20 shadow-sm w-full h-full max-h-[200px] flex gap-3 text-xs overflow-hidden">
                    <div className="w-1/3 bg-muted rounded-lg animate-pulse" />
                    <div className="w-1/3 bg-muted rounded-lg animate-pulse delay-75" />
                    <div className="w-1/3 bg-muted rounded-lg animate-pulse delay-150" />
                </div>
            </motion.div>

            {/* Side Feature 1 */}
            <motion.div 
                 whileHover={{ scale: 1.02 }}
                className="md:col-span-2 rounded-[2rem] bg-white/40 border border-border p-8 flex items-center justify-between group overflow-hidden"
            >
                <div className="relative z-10">
                    <div className="bg-orange-100 w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-orange-600">
                        <Shield size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Moderation Control</h3>
                    <p className="text-sm text-muted-foreground mt-1">Filter the noise. Approve only the best.</p>
                </div>
                <div className="w-24 h-24 rounded-full border-4 border-orange-100 group-hover:scale-110 transition-transform flex items-center justify-center text-4xl opacity-20">
                    🛡️
                </div>
            </motion.div>

            {/* Side Feature 2 */}
            <motion.div 
                 whileHover={{ scale: 1.02 }}
                className="md:col-span-1 rounded-[2rem] bg-[#E3F2FD] border border-blue-100 p-6 flex flex-col justify-center"
            >
                <div className="text-blue-500 mb-4">
                    <Zap size={32} />
                </div>
                <h3 className="text-lg font-bold text-blue-900">Blazing Fast</h3>
                <p className="text-xs text-blue-700/70 mt-1">Redis cached embeds load in &lt;50ms.</p>
            </motion.div>

            {/* Side Feature 3 */}
            <motion.div 
                 whileHover={{ scale: 1.02 }}
                className="md:col-span-1 rounded-[2rem] bg-[#F5F5F4] border border-stone-200 p-6 flex flex-col justify-center relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Star size={80} />
                </div>
                <h3 className="text-lg font-bold text-stone-800">Organic Growth</h3>
                <p className="text-xs text-stone-500 mt-1">Watch your reputation grow naturally.</p>
            </motion.div>
        </div>
    )
}
