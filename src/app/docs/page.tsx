"use client";

import React from "react";
import { motion } from "framer-motion";
import ThreeBackground from "@/components/ThreeBackground";
import { Terminal, Database, Server, Code, Shield, Cpu, BookOpen, Layers } from "lucide-react";
import Image from "next/image";

export default function DocsPage() {
  const sections = [
    {
      id: "intro",
      title: "Introduction",
      icon: <Terminal className="w-6 h-6 text-primary" />,
      content: (
        <div className="space-y-4">
          <p className="text-lg text-muted-foreground leading-relaxed">
            TestiSpace is an all-in-one platform designed for modern SaaS businesses to collect, manage, and embed video and text testimonials seamlessly. Built with a futuristic Space theme aesthetic, it combines powerful functionality with stunning visuals.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <FeatureCard title="Futuristic UI/UX" desc="Immersive dark mode design with glassmorphism and neon accents." />
            <FeatureCard title="Multi-Media Collection" desc="Accept both Text and Video testimonials directly from users." />
            <FeatureCard title="One-Line Embed" desc="Drop a single line of JS code to showcase your testimonials anywhere." />
            <FeatureCard title="Smart Media Storage" desc="Integrated Cloudinary support for optimized video/image uploads." />
          </div>
        </div>
      ),
    },
    {
      id: "architecture",
      title: "System Architecture",
      icon: <Layers className="w-6 h-6 text-purple-400" />,
      content: (
        <>
            <div className="space-y-6">
                <p className="text-muted-foreground">TestiSpace leverages a serverless architecture designed for scalability and performance.</p>
                <div className="bg-secondary/30 border border-border rounded-xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Server size={120} />
                    </div>
                    <ul className="space-y-4 relative z-10">
                        <ArchItem title="Frontend" desc="Next.js Client Components for interactive UI (Dashboards, Forms)." />
                        <ArchItem title="Backend" desc="Next.js API Routes handle DB operations and file signing." />
                        <ArchItem title="Database" desc="MongoDB (via Mongoose) stores user data, spaces, and testimonials." />
                        <ArchItem title="Embed Engine" desc="Standalone vanilla JS script using Shadow DOM for isolation." />
                    </ul>
                </div>
            </div>
            <Image src='/architecture-v2.png' alt="Architecture" width={1200} height={630} />
        </>
      )
    },
    {
      id: "tech-stack",
      title: "Tech Stack",
      icon: <Cpu className="w-6 h-6 text-blue-400" />,
      content: (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <TechItem name="Next.js 14" desc="App Router" />
            <TechItem name="TypeScript" desc="Type Safety" />
            <TechItem name="MongoDB" desc="Database" />
            <TechItem name="Tailwind CSS" desc="Styling" />
            <TechItem name="Framer Motion" desc="Animations" />
            <TechItem name="NextAuth.js" desc="Authentication" />
            <TechItem name="Cloudinary" desc="Media Storage" />
            <TechItem name="Vercel" desc="Hosting" />
        </div>
      )
    },
    {
        id: "setup",
        title: "Getting Started",
        icon: <BookOpen className="w-6 h-6 text-green-400" />,
        content: (
            <div className="space-y-4 text-sm font-mono bg-black/50 p-6 rounded-xl border border-border">
                <div>
                    <p className="text-muted-foreground mb-2"># Clone the repository</p>
                    <p className="text-green-400">git clone https://github.com/xeylous/testispace.git</p>
                </div>
                <div>
                    <p className="text-muted-foreground mb-2"># Install dependencies</p>
                    <p className="text-green-400">npm install</p>
                </div>
                <div>
                    <p className="text-muted-foreground mb-2"># Run development server</p>
                    <p className="text-green-400">npm run dev</p>
                </div>
            </div>
        )
    }
  ];

  return (
    <div className="relative min-h-screen text-foreground selection:bg-primary selection:text-white">
      <ThreeBackground />
      
      <main className="relative z-10 container mx-auto px-4 py-20 max-w-5xl">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-400 to-blue-500 bg-clip-text text-transparent">
                Documentation
            </h1>
            <p className="text-xl text-muted-foreground mb-16 max-w-2xl">
                Explore the technical details, architecture, and setup guide for TestiSpace.
            </p>
        </motion.div>

        <div className="space-y-20">
            {sections.map((section, idx) => (
                <motion.section
                    key={section.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="relative"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-secondary/30 flex items-center justify-center border border-white/5 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                            {section.icon}
                        </div>
                        <h2 className="text-3xl font-bold">{section.title}</h2>
                    </div>
                    
                    <div className="pl-4 md:pl-16 border-l-2 border-primary/20">
                        {section.content}
                    </div>
                </motion.section>
            ))}
        </div>

        <div className="mt-20 pt-10 border-t border-border/40 text-center text-muted-foreground">
            <p>Ready to build?</p>
            <div className="mt-4 flex justify-center gap-4">
                 <a href="https://github.com/xeylous/testispace" target="_blank" className="flex items-center gap-2 hover:text-zinc-900 transition-colors">
                    <Code size={16} /> GitHub
                 </a>
            </div>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="bg-secondary/20 border border-white/5 p-4 rounded-lg hover:bg-secondary/30 transition-colors">
            <h3 className="font-bold mb-2 text-primary">{title}</h3>
            <p className="text-sm text-muted-foreground">{desc}</p>
        </div>
    )
}

function ArchItem({ title, desc }: { title: string, desc: string }) {
    return (
        <li className="flex gap-3">
            <div className="mt-1.5 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
            <div>
                <span className="font-bold text-foreground block">{title}</span>
                <span className="text-sm text-muted-foreground">{desc}</span>
            </div>
        </li>
    )
}

function TechItem({ name, desc }: { name: string, desc: string }) {
    return (
        <div className="bg-secondary/20 border border-border p-3 rounded-lg text-center hover:border-primary/50 transition-colors cursor-default">
            <div className="font-bold text-foreground">{name}</div>
            <div className="text-xs text-muted-foreground">{desc}</div>
        </div>
    )
}
