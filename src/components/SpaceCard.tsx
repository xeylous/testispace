"use client";

import Link from "next/link";
import { Settings, MessageSquare, ExternalLink, Copy, Check, Share2 } from "lucide-react";
import { useState } from "react";

interface SpaceCardProps {
  space: {
    _id: string;
    name: string;
    slug: string;
    testimonialCount: number;
  };
  baseUrl: string;
}

export default function SpaceCard({ space, baseUrl }: SpaceCardProps) {
  const [copied, setCopied] = useState(false);
  const publicUrl = `${baseUrl}/${space.slug}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: space.name,
          text: `Share your feedback for ${space.name}`,
          url: publicUrl,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="glass-card p-6 rounded-xl hover:bg-white/5 transition-colors group">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold truncate">{space.name}</h3>
        <Link href={`/${space.slug}`} target="_blank" className="text-muted-foreground hover:text-accent">
          <ExternalLink size={18} />
        </Link>
      </div>

      {/* Public Link Section */}
      <div className="bg-muted/50 rounded-lg p-3 mb-4">
        <p className="text-xs text-muted-foreground mb-2">Public feedback link:</p>
        <div className="flex items-center gap-2">
          <code className="text-xs text-primary bg-background/50 px-2 py-1 rounded flex-1 truncate">
            {publicUrl}
          </code>
          <button
            onClick={handleCopyLink}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
            title="Copy link"
          >
            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
          </button>
          <button
            onClick={handleShare}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
            title="Share"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t border-border">
        <div className="flex items-center gap-1">
          <MessageSquare size={16} />
          <span>{space.testimonialCount} Testimonial{space.testimonialCount !== 1 ? 's' : ''}</span>
        </div>
        <Link href={`/dashboard/space/${space.slug}`} className="ml-auto flex items-center gap-1 hover:text-white transition-colors">
          <Settings size={16} />
          Manage
        </Link>
      </div>
    </div>
  );
}
