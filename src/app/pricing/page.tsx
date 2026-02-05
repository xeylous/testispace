"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import ThreeBackground from "@/components/ThreeBackground";
import Link from "next/link";
import { useState } from "react";

export default function PricingPage() {
    const [isYearly, setIsYearly] = useState(true);

    return (
        <div className="relative min-h-screen text-foreground overflow-hidden selection:bg-primary selection:text-white">
            <ThreeBackground />

            <main className="relative z-10 px-4 pt-32 pb-20">
                {/* Hero */}
                <div className="max-w-7xl mx-auto text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Simple, Transparent <br/>
                            <span className="text-primary">Pricing</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                            Start for free, scale as you grow. No credit card required.
                        </p>

                        {/* Toggle */}
                        <div className="flex items-center justify-center gap-4 mb-8">
                             <span className={`text-sm font-medium ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
                             <button
                                onClick={() => setIsYearly(!isYearly)}
                                className="relative w-14 h-8 bg-muted rounded-full p-1 transition-colors"
                             >
                                <motion.div
                                    animate={{ x: isYearly ? 24 : 0 }}
                                    className="w-6 h-6 bg-white rounded-full shadow-sm"
                                />
                             </button>
                             <span className={`text-sm font-medium ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
                                Yearly <span className="text-primary text-xs bg-primary/10 px-2 py-0.5 rounded-full ml-1">-20%</span>
                             </span>
                        </div>
                    </motion.div>
                </div>

                {/* Pricing Cards */}
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-32 px-4 md:px-0">
                    {/* Free Plan */}
                    <PricingCard
                        title="Free"
                        price={0}
                        description="Perfect for hobby projects and portfolios."
                        features={[
                            "3 Video Testimonials",
                            "10 Text Testimonials",
                            "Basic Embed Styles",
                            "TestiSpace Branding",
                            "1 Space"
                        ]}
                        missingFeatures={[
                            "Custom Branding",
                            "Export Data",
                            "Team Members",
                            "API Access"
                        ]}
                        delay={0.1}
                    />

                    {/* Pro Plan */}
                    <PricingCard
                        title="Pro"
                        price={isYearly ? 29 : 19}
                        description="For serious creators and startups."
                        popular={true}
                        features={[
                            "Unlimited Video Testimonials",
                            "Unlimited Text Testimonials",
                            "Remove Branding",
                            "Custom Colors & Styles",
                            "Export Data (CSV)",
                            "3 Spaces",
                            "Priority Support"
                        ]}
                        missingFeatures={[
                            "Team Members",
                            "API Access"
                        ]}
                        isYearly={isYearly}
                        delay={0.2}
                    />

                    {/* Enterprise Plan */}
                    <PricingCard
                         title="Business"
                         price={isYearly ? 99 : 79}
                         description="For teams and agencies."
                         features={[
                             "Everything in Pro",
                             "Unlimited Spaces",
                             "10 Team Members",
                             "API Access",
                             "Custom Contracts",
                             "Dedicated Success Manager",
                             "SSO (Coming Soon)"
                         ]}
                         missingFeatures={[]}
                         isYearly={isYearly}
                         delay={0.3}
                     />
                </div>

                {/* FAQ */}
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        <FAQItem 
                            question="Can I upgrade or downgrade later?"
                            answer="Yes, you can upgrade or downgrade your plan at any time. Changes will take effect at the start of the next billing cycle."
                        />
                        <FAQItem 
                            question="How does the 14-day free trial work?"
                            answer="You get full access to all Pro features for 14 days. No credit card required. At the end of the trial, you can choose to upgrade or stay on the Free plan."
                        />
                        <FAQItem 
                            question="Do you offer refunds?"
                            answer="We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, just let us know."
                        />
                         <FAQItem 
                            question="Can I remove the 'Powered by TestiSpace' badge?"
                            answer="Yes! The Pro and Business plans allow you to remove all TestiSpace branding from your embeds."
                        />
                    </div>
                </div>

            </main>
        </div>
    );
}

function PricingCard({ title, price, description, features, missingFeatures, popular, isYearly, delay }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -10 }}
            viewport={{ once: true }}
            transition={{ delay: delay, duration: 0.5 }}
            className={`relative p-8 rounded-3xl border flex flex-col h-full bg-card glass-card
                ${popular ? 'border-primary ring-2 ring-primary/20 shadow-xl' : 'border-border shadow-sm'}
            `}
        >
            {popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                </div>
            )}

            <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm h-10">{description}</p>
            </div>

            <div className="mb-8">
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">${price}</span>
                    <span className="text-muted-foreground">/mo</span>
                </div>
                {isYearly && price > 0 && (
                    <p className="text-xs text-primary mt-1 font-medium">Billed ${price * 12} yearly</p>
                )}
            </div>

            <div className="space-y-4 flex-1 mb-8">
                {features.map((feature: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                        <Check className="w-5 h-5 text-primary shrink-0" />
                        <span>{feature}</span>
                    </div>
                ))}
                {missingFeatures.map((feature: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-muted-foreground/50">
                        <X className="w-5 h-5 shrink-0" />
                        <span className="line-through">{feature}</span>
                    </div>
                ))}
            </div>

            <Link
                href="/register"
                className={`w-full py-3 rounded-xl font-semibold text-center transition-all ${
                    popular 
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg' 
                    : 'bg-secondary text-secondary-foreground hover:bg-white/10 border border-border'
                }`}
            >
                {price === 0 ? "Get Started" : "Start Free Trial"}
            </Link>
        </motion.div>
    )
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div 
            onClick={() => setIsOpen(!isOpen)}
            className="border border-border rounded-2xl p-6 cursor-pointer bg-card/50 hover:bg-card/80 transition-colors"
        >
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">{question}</h3>
                <span className={`text-2xl transition-transform ${isOpen ? 'rotate-45' : ''}`}>+</span>
            </div>
            {isOpen && (
                <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-muted-foreground leading-relaxed"
                >
                    {answer}
                </motion.p>
            )}
        </div>
    )
}
