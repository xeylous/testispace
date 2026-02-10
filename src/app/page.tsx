"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, Shield, Zap, Play, BadgeCheck } from "lucide-react";
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
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-xs font-medium text-primary">v1.0 Public Beta</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-foreground">
            TestiSpace: Collect <br />
            <span className="text-primary">Testimonials From The Future</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            TestiSpace is the all-in-one platform to collect, manage, and embed video & text testimonials. 
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
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 max-w-5xl mx-auto mt-20 md:mt-32 h-auto md:h-[600px] px-4 md:px-0">
            {/* Main Feature - Large */}
            <motion.div 
                whileHover={{ scale: 1.01 }}
                className="md:col-span-2 md:row-span-2 min-h-[350px] md:min-h-0 rounded-[2rem] bg-card glass-card p-6 md:p-8 flex flex-col justify-between overflow-hidden relative group"
            >
                <div className="relative z-10">
                    <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-primary">
                        <Star size={24} fill="currentColor" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">Collect & Embed</h3>
                    <p className="text-sm md:text-base text-muted-foreground">Collect video & text testimonials. Embed them with a single line of code.</p>
                </div>
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl group-hover:bg-primary/30 transition-colors" />
                
                {/* Visual Mockup - Realistic Testimonial + Embed Code */}
                <div className="mt-8 relative h-[220px] w-full">
                     {/* Code Snippet Floating Behind (Parallax Effect) */}
                     <div className="absolute top-0 right-4 z-0 w-3/4 bg-[#1e1e1e]/90 backdrop-blur rounded-xl p-4 border border-white/10 shadow-2xl opacity-80 transform rotate-6 translate-y-2 transition-all duration-500 group-hover:rotate-3 group-hover:translate-y-0 group-hover:opacity-100 group-hover:scale-105">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                                <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                            </div>
                            <div className="text-[10px] text-gray-500 font-mono">embed.js</div>
                        </div>
                        <div className="space-y-2 font-mono text-[10px]">
                            <div className="flex gap-2">
                                <span className="text-purple-400">const</span>
                                <span className="text-blue-400">embed</span>
                                <span className="text-white">=</span>
                                <span className="text-orange-400">new</span>
                                <span className="text-yellow-400">TestiSpace</span>();
                            </div>
                            <div className="flex gap-2 pl-4">
                                <span className="text-blue-400">embed</span>.<span className="text-yellow-400">init</span>("<span className="text-green-400">YOUR_ID</span>");
                            </div>
                        </div>
                     </div>

                    {/* Main Testimonial Card */}
                    <div className="absolute top-6 left-0 z-10 w-full bg-background/80 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-xl transform transition-all duration-500 group-hover:-translate-y-2 group-hover:bg-background/95">
                         <div className="flex items-start gap-4">
                             {/* Avatar with Video Indicator */}
                             <div className="relative shrink-0">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-400 via-purple-400 to-cyan-400 p-0.5">
                                    <div className="w-full h-full bg-background rounded-full p-0.5 overflow-hidden relative">
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/10" />
                                    </div>
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground w-6 h-6 flex items-center justify-center rounded-full border-2 border-background shadow-sm">
                                    <Play size={10} fill="currentColor" className="ml-0.5" />
                                </div>
                             </div>
                             
                             <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-1.5">
                                        <h4 className="font-bold text-sm truncate text-foreground">Alex Rivera</h4>
                                        <BadgeCheck size={14} className="text-blue-500" fill="rgba(59, 130, 246, 0.1)" />
                                    </div>
                                    <span className="text-[10px] font-medium text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded-full">Pro User</span>
                                </div>
                                <div className="flex items-center gap-0.5 mb-2.5">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <Star key={i} size={11} className="fill-orange-400 text-orange-400 drop-shadow-sm" />
                                    ))}
                                </div>
                                <p className="text-sm text-foreground/80 leading-snug line-clamp-2 font-medium">
                                    "This tool is pure magic. <span className="text-primary">Engagement went up 40%</span> in just one week!"
                                </p>
                             </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Side Feature 1 - Moderation */}
            <motion.div 
                 whileHover={{ scale: 1.02 }}
                className="md:col-span-2 min-h-[150px] rounded-[2rem] bg-card glass-card p-6 md:p-8 flex items-center justify-between group overflow-hidden relative"
            >
                <div className="relative z-10 max-w-[60%]">
                    <div className="bg-orange-100 w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-orange-600">
                        <Shield size={20} />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-foreground">Moderation</h3>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">Full control over what goes public.</p>
                </div>
                
                {/* Toggle Mockup */}
                <div className="bg-background border border-border rounded-lg p-3 shadow-sm z-10 group-hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2 opacity-50">
                         <div className="w-2 h-2 rounded-full bg-red-500" />
                         <div className="h-1.5 w-12 bg-muted rounded" />
                    </div>
                    <div className="flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                         <div className="h-2 w-16 bg-foreground/80 rounded" />
                         <div className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] rounded-full font-bold">Live</div>
                    </div>
                </div>
            </motion.div>

            {/* Side Feature 2 - Fast */}
            <motion.div 
                 whileHover={{ scale: 1.02 }}
                className="md:col-span-1 min-h-[150px] rounded-[2rem] bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-5 md:p-6 flex flex-col justify-center relative overflow-hidden"
            >
                 <div className="absolute top-0 right-0 p-4 text-blue-500/10">
                    <Zap size={80} />
                </div>
                <div className="text-blue-500 mb-3 md:mb-4 relative z-10">
                    <Zap size={32} />
                </div>
                <h3 className="text-base md:text-lg font-bold text-blue-900 dark:text-blue-100 relative z-10">Blazing Fast</h3>
                <p className="text-xs text-blue-700/70 dark:text-blue-300/70 mt-1 relative z-10">Sub-50ms loads via Redis.</p>
            </motion.div>

            {/* Side Feature 3 - Growth */}
            <motion.div 
                 whileHover={{ scale: 1.02 }}
                className="md:col-span-1 min-h-[150px] rounded-[2rem] bg-stone-50/50 dark:bg-stone-900/20 border border-stone-200 dark:border-stone-800 p-5 md:p-6 flex flex-col justify-center relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Star size={80} />
                </div>
                <h3 className="text-base md:text-lg font-bold text-stone-800 dark:text-stone-200">Organic Growth</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">Boost conversions with social proof.</p>
                <div className="mt-4 flex -space-x-2">
                    {[1,2,3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-stone-900 bg-gray-200" />
                    ))}
                    <div className="w-6 h-6 rounded-full border-2 border-white dark:border-stone-900 bg-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-500">+99</div>
                </div>
            </motion.div>
        </div>
    )
}
