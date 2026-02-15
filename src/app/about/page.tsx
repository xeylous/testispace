"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, Zap, Shield, Code, Users, Sparkles } from "lucide-react";
import ThreeBackground from "@/components/ThreeBackground";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen text-foreground overflow-hidden selection:bg-primary selection:text-white">
      {/* Background */}
      <ThreeBackground />

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 mb-8">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-xs font-medium text-primary">About TestiSpace</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-foreground">
            Built for the <br />
            <span className="text-primary">Future of Social Proof</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            TestiSpace is a modern platform designed to help businesses collect, manage, and showcase 
            testimonials with unprecedented ease and style.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="max-w-5xl mx-auto mt-16 mb-20"
        >
          <div className="glass-card bg-card rounded-[2rem] p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Our Mission</h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-4">
              In today's digital landscape, trust is everything. We believe that authentic testimonials 
              are the cornerstone of building credibility and driving conversions. TestiSpace was created 
              to make collecting and displaying testimonials as seamless as possible.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Our platform combines cutting-edge technology with beautiful design to help businesses of 
              all sizes leverage the power of social proof. From video testimonials to text reviews, 
              we've built the tools you need to grow your brand authentically.
            </p>
          </div>
        </motion.div>

        {/* Key Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="max-w-5xl mx-auto mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-foreground">Why TestiSpace?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-card bg-card rounded-[2rem] p-6 md:p-8"
            >
              <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-primary">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">
                Built on Redis for sub-50ms response times. Your testimonials load instantly, 
                keeping your visitors engaged.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-card bg-card rounded-[2rem] p-6 md:p-8"
            >
              <div className="bg-orange-100 dark:bg-orange-900/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-orange-600 dark:text-orange-400">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Full Control</h3>
              <p className="text-sm text-muted-foreground">
                Moderate every testimonial before it goes live. Maintain your brand's reputation 
                with powerful approval workflows.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-card bg-card rounded-[2rem] p-6 md:p-8"
            >
              <div className="bg-blue-100 dark:bg-blue-900/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                <Code size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Easy Integration</h3>
              <p className="text-sm text-muted-foreground">
                Embed testimonials anywhere with a single line of code. Multiple layouts, 
                real-time updates, fully customizable.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Technology Stack */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="max-w-5xl mx-auto mb-20"
        >
          <div className="glass-card bg-card rounded-[2rem] p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Built with Modern Tech</h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8">
              TestiSpace leverages the latest technologies to deliver a fast, reliable, and scalable platform:
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Next.js 15", desc: "React Framework" },
                { name: "Redis", desc: "Lightning Cache" },
                { name: "MongoDB", desc: "Database" },
                { name: "Pusher", desc: "Real-time Updates" },
                { name: "TypeScript", desc: "Type Safety" },
                { name: "Tailwind CSS", desc: "Styling" },
                { name: "NextAuth", desc: "Authentication" },
                { name: "Cloudflare", desc: "Security" }
              ].map((tech, index) => (
                <div 
                  key={index}
                  className="bg-muted/30 rounded-xl p-4 text-center border border-border/50"
                >
                  <div className="font-bold text-sm text-foreground mb-1">{tech.name}</div>
                  <div className="text-xs text-muted-foreground">{tech.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Team/Creator Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="max-w-5xl mx-auto mb-20"
        >
          <div className="glass-card bg-card rounded-[2rem] p-8 md:p-12 text-center">
            <Users className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Built for Hackathon</h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              TestiSpace was created as a hackathon project to demonstrate the power of modern web technologies 
              in solving real business problems. What started as an experiment has grown into a fully-featured 
              platform that businesses can rely on.
            </p>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join businesses already using TestiSpace to boost their credibility and conversions.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="group relative inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold px-8 py-4 rounded-full transition-all shadow-[0_0_20px_rgba(156,171,132,0.5)] hover:shadow-[0_0_30px_rgba(156,171,132,0.7)]"
            >
              Start Free Today
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/features"
              className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-foreground text-lg font-medium px-8 py-4 rounded-full border border-border transition-all backdrop-blur-sm"
            >
              Explore Features
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
