"use client";

import { useState } from "react";
import { Star, Video, FileText, Image, Copy, Check, CheckCircle, XCircle, Code } from "lucide-react";

interface Testimonial {
  _id: string;
  type: 'text' | 'video' | 'image';
  content: string;
  rating: number;
  userDetails: {
    name: string;
    email: string;
    designation: string;
  };
  isApproved: boolean;
  isArchived: boolean;
  createdAt: string;
}

interface TestimonialsTableProps {
  testimonials: Testimonial[];
  baseUrl: string;
}

export default function TestimonialsTable({ testimonials, baseUrl }: TestimonialsTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleCopyEmbed = async (id: string) => {
    const embedCode = `<script src="${baseUrl}/embed.js" data-testimonial-id="${id}" data-layout="single"></script>`;
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'video': return <Video size={16} className="text-blue-500" />;
      case 'image': return <Image size={16} className="text-purple-500" />;
      default: return <FileText size={16} className="text-primary" />;
    }
  };

  if (testimonials.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No testimonials yet. Share your feedback link to start collecting!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
            <th className="p-4 font-semibold">From</th>
            <th className="p-4 font-semibold">Type</th>
            <th className="p-4 font-semibold">Rating</th>
            <th className="p-4 font-semibold">Status</th>
            <th className="p-4 font-semibold">Date</th>
            <th className="p-4 font-semibold text-right">Embed</th>
          </tr>
        </thead>
        <tbody>
          {testimonials.map((t) => (
            <>
              <tr 
                key={t._id} 
                className="border-b border-border/50 hover:bg-white/5 transition-colors cursor-pointer"
                onClick={() => setExpandedId(expandedId === t._id ? null : t._id)}
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {t.userDetails.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{t.userDetails.name}</p>
                      {t.userDetails.designation && (
                        <p className="text-xs text-muted-foreground">{t.userDetails.designation}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 capitalize">
                    {getTypeIcon(t.type)}
                    {t.type}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1 text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < t.rating ? "currentColor" : "none"} />
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  {t.isApproved ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium bg-green-500/20 text-green-500 px-2 py-1 rounded-full">
                      <CheckCircle size={12} /> Approved
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-full">
                      <XCircle size={12} /> Pending
                    </span>
                  )}
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {formatDate(t.createdAt)}
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyEmbed(t._id);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-medium bg-primary/20 hover:bg-primary/30 text-primary px-3 py-1.5 rounded-lg transition-colors"
                    title="Copy individual embed code"
                  >
                    {copiedId === t._id ? (
                      <>
                        <Check size={12} /> Copied!
                      </>
                    ) : (
                      <>
                        <Code size={12} /> Embed
                      </>
                    )}
                  </button>
                </td>
              </tr>
              {/* Expanded Content Row */}
              {expandedId === t._id && (
                <tr className="bg-muted/30">
                  <td colSpan={6} className="p-4">
                    <div className="space-y-4">
                      {t.type === 'text' && (
                        <div className="bg-background/50 p-4 rounded-lg border border-border">
                          <p className="italic">"{t.content}"</p>
                        </div>
                      )}
                      {t.type === 'video' && (
                        <video 
                          src={t.content} 
                          controls 
                          className="w-full max-w-md rounded-lg"
                        />
                      )}
                      {t.type === 'image' && (
                        <img 
                          src={t.content} 
                          alt="Testimonial" 
                          className="max-w-md rounded-lg"
                        />
                      )}
                      <div className="flex gap-2">
                        <span className="text-xs text-muted-foreground">Email: {t.userDetails.email || 'Not provided'}</span>
                      </div>
                      <div className="bg-black/50 p-3 rounded-lg font-mono text-xs text-green-400 overflow-x-auto">
                        <code>
                          &lt;script src="{baseUrl}/embed.js" data-testimonial-id="{t._id}" data-layout="single"&gt;&lt;/script&gt;
                        </code>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
