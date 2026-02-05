"use client";

import { motion } from "framer-motion";
import { 
    MessageSquare, 
    ShieldCheck, 
    Zap, 
    Palette, 
    Code, 
    Layout, 
    LineChart,
    Globe
} from "lucide-react";
import ThreeBackground from "@/components/ThreeBackground";

export default function FeaturesPage() {
    return (
        <div className="relative min-h-screen text-foreground overflow-hidden selection:bg-primary selection:text-white">
            <ThreeBackground />

            {/* Hero Section */}
            <main className="relative z-10 px-4 pt-32 pb-20">
                <div className="max-w-7xl mx-auto text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Powerful Features for <br/>
                            <span className="text-primary">Modern Feedback</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                            Everything you need to collect, manage, and showcase testimonials that convert.
                        </p>
                    </motion.div>
                </div>

                {/* Features Grid */}
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
                    <FeatureCard
                        icon={<MessageSquare className="w-8 h-8" />}
                        title="Video & Text Collection"
                        description="Collect high-quality video testimonials and text feedback through a beautiful, customizable form."
                        delay={0.1}
                    />
                    <FeatureCard
                        icon={<Layout className="w-8 h-8" />}
                        title="Beautiful Embeds"
                        description="Choose from multiple layout options including grid, carousel, and wall of love."
                        delay={0.2}
                    />
                    <FeatureCard
                        icon={<ShieldCheck className="w-8 h-8" />}
                        title="Moderation Tools"
                        description="Review every testimonial before it goes live. Filter out spam and keep only the best."
                        delay={0.3}
                    />
                    <FeatureCard
                        icon={<Zap className="w-8 h-8" />}
                        title="Lightning Fast"
                        description="Powered by Redis caching for sub-50ms load times. Won't slow down your site."
                        delay={0.4}
                    />
                    <FeatureCard
                        icon={<Palette className="w-8 h-8" />}
                        title="Theme Customization"
                        description="Match your brand perfectly with custom colors, fonts, and dark mode support."
                        delay={0.5}
                    />
                    <FeatureCard
                        icon={<Code className="w-8 h-8" />}
                        title="Easy Integration"
                        description="Copy a single line of code to embed testimonials on React, Vue, WordPress, and more."
                        delay={0.6}
                    />
                </div>

                {/* Alternating Detail Sections */}
                <div className="max-w-7xl mx-auto space-y-32">
                    {/* Section 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="bg-primary/10 w-fit p-3 rounded-2xl mb-6 text-primary">
                                <Globe className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Embed Anywhere</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Our platform-agnostic embed script works everywhere. Whether you're building with Next.js, 
                                using Shopify, or running a WordPress blog, showing off your social proof is just a copy-paste away.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="bg-card glass-card p-8 rounded-3xl border border-border h-[400px] flex items-center justify-center relative overflow-hidden"
                        >
                             <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                             <div className="text-sm font-mono text-muted-foreground bg-muted/50 p-6 rounded-xl w-full max-w-md border border-border/50 shadow-sm">
                                <span className="text-primary">{"<script"}</span> src="https://testispace.com/embed.js"<span className="text-primary">{"></script>"}</span>
                                <br/>
                                <span className="text-primary">{"<testi-space-embed"}</span> id="your-id"<span className="text-primary">{"></testi-space-embed>"}</span>
                             </div>
                        </motion.div>
                    </div>

                     {/* Section 2 */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="order-2 md:order-1 bg-card glass-card p-8 rounded-3xl border border-border h-[400px] flex items-center justify-center relative overflow-hidden"
                        >
                            <div className="absolute top-10 right-10 p-4 bg-green-100 rounded-full text-green-700 animate-bounce">
                                <ShieldCheck size={32} />
                            </div>
                             <div className="absolute bottom-10 left-10 p-4 bg-red-100 rounded-full text-red-700">
                                <ShieldCheck size={32} />
                            </div>
                            <div className="text-center z-10">
                                <h3 className="text-2xl font-bold mb-2">Total Control</h3>
                                <p className="text-muted-foreground">Approve, Reject, or Archive with one click.</p>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="order-1 md:order-2"
                        >
                            <div className="bg-orange-100 w-fit p-3 rounded-2xl mb-6 text-orange-600">
                                <LineChart className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Analytics & Insights</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Track how your testimonials are performing. See view counts, interactions, 
                                and conversion uplift. Understand what resonates with your audience.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            viewport={{ once: true }}
            transition={{ delay: delay, duration: 0.5 }}
            className="bg-card glass-card p-8 rounded-3xl border border-border shadow-sm hover:shadow-md transition-all"
        >
            <div className="bg-secondary/50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-foreground">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">
                {description}
            </p>
        </motion.div>
    );
}
