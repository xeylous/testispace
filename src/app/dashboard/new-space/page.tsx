"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function NewSpacePage() {
  const [name, setName] = useState("");
  const [headerTitle, setHeaderTitle] = useState("Share your experience");
  const [customMessage, setCustomMessage] = useState("We would love to hear from you!");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/spaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, headerTitle, customMessage }),
      });
      
      if (res.ok) {
        router.push("/dashboard");
      } else {
        alert("Failed to create space");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create a new Space</h1>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 rounded-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium mb-2">Space Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-input border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-ring outline-none transition-all text-foreground"
                    placeholder="e.g. TestiSpace Feedback"
                    required
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium mb-2">Header Title</label>
                <input
                    type="text"
                    value={headerTitle}
                    onChange={(e) => setHeaderTitle(e.target.value)}
                    className="w-full bg-input border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-ring outline-none transition-all text-foreground"
                    placeholder="Share your experience"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Custom Message</label>
                <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="w-full bg-input border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-ring outline-none transition-all text-foreground min-h-[100px]"
                    placeholder="We would love to hear from you!"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(139,92,246,0.5)] disabled:opacity-50"
            >
                {loading ? "Creating..." : "Create Space"}
            </button>
        </form>
      </motion.div>
    </div>
  );
}
