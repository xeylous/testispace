"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Save, Trash2, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface SettingsClientProps {
  space: {
    _id: string;
    name: string;
    slug: string;
    headerTitle: string;
    customMessage: string;
  };
}

export default function SettingsClient({ space }: SettingsClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Form States
  const [name, setName] = useState(space.name);
  const [headerTitle, setHeaderTitle] = useState(space.headerTitle);
  const [customMessage, setCustomMessage] = useState(space.customMessage);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/spaces/${space._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, headerTitle, customMessage }),
      });

      if (res.ok) {
        alert("Space settings updated successfully!");
        router.refresh();
      } else {
        alert("Failed to update settings");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this space? This action cannot be undone and all testimonials will be lost.")) {
      return;
    }

    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/spaces/${space._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        alert("Failed to delete space");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link 
        href={`/dashboard/space/${space.slug}`} 
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Space
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Space Settings
        </h1>
        <p className="text-muted-foreground mt-2">Manage your space configuration and danger zone.</p>
      </div>

      {/* General Settings */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 rounded-xl mb-8 border border-border"
      >
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
           <div className="p-2 bg-primary/10 rounded-lg text-primary">
             <Save size={20} />
           </div>
           <div>
             <h2 className="text-xl font-bold">General Configuration</h2>
             <p className="text-sm text-muted-foreground">Update your space details and public appearance.</p>
           </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium mb-2">Space Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-ring outline-none transition-all text-foreground"
                  placeholder="My Awesome Space"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                    Note: Renaming the space will NOT change the URL slug ({space.slug}).
                </p>
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
                <input
                  type="text"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-ring outline-none transition-all text-foreground"
                  placeholder="We would love to hear from you!"
                />
             </div>
          </div>

          <div className="pt-4">
             <button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center gap-2"
             >
                {loading ? "Saving..." : "Save Changes"}
             </button>
          </div>
        </form>
      </motion.div>

      {/* Danger Zone */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="border border-red-500/30 bg-red-500/5 rounded-xl p-8"
      >
         <div className="flex items-center gap-3 mb-6 pb-4 border-b border-red-500/20">
           <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
             <AlertTriangle size={20} />
           </div>
           <div>
             <h2 className="text-xl font-bold text-red-500">Danger Zone</h2>
             <p className="text-sm text-red-400/80">Irreversible actions. Proceed with caution.</p>
           </div>
        </div>

        <div className="flex items-center justify-between">
            <div>
                <h3 className="font-bold">Delete this Space</h3>
                <p className="text-sm text-muted-foreground mt-1">
                    Once you delete a space, there is no going back. All testimonials will be permanently removed.
                </p>
            </div>
            <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 whitespace-nowrap"
            >
                {deleteLoading ? "Deleting..." : <><Trash2 size={16} /> Delete Space</>}
            </button>
        </div>
      </motion.div>
    </div>
  );
}
