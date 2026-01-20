'use client'
import React, { useState } from "react";
import { Star, Video, FileText, Image, Copy, Check, CheckCircle, XCircle, Code, Trash2, Archive, Share2 } from "lucide-react";

interface Testimonial {
  _id: string;
  textContent?: string;
  mediaUrl?: string;
  mediaType: 'none' | 'image' | 'video';
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

export default function TestimonialsTable({ testimonials: initialTestimonials, baseUrl }: TestimonialsTableProps) {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleAction = async (id: string, action: 'approve' | 'archive' | 'delete') => {
    setActionLoading(id);
    try {
      if (action === 'delete') {
        if (!confirm("Are you sure you want to delete this testimonial?")) return;
        const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setTestimonials(prev => prev.filter(t => t._id !== id));
        }
      } else {
        const body = action === 'approve' 
          ? { isApproved: !testimonials.find(t => t._id === id)?.isApproved }
          : { isArchived: !testimonials.find(t => t._id === id)?.isArchived };

        const res = await fetch(`/api/testimonials/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (res.ok) {
          const { testimonial: updated } = await res.json();
          setTestimonials(prev => prev.map(t => t._id === id ? { ...t, isApproved: updated.isApproved, isArchived: updated.isArchived } : t));
        }
      }
    } catch (err) {
      console.error("Action failed:", err);
    } finally {
      setActionLoading(null);
    }
  };

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
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return "N/A";
    }
  };

  const getTypeIcon = (t: Testimonial) => {
    if (t.mediaType === 'video') return <Video size={16} className="text-blue-500" />;
    if (t.mediaType === 'image') return <Image size={16} className="text-purple-500" />;
    return <FileText size={16} className="text-primary" />;
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
            <th className="p-4 font-semibold">Content Type</th>
            <th className="p-4 font-semibold">Rating</th>
            <th className="p-4 font-semibold">Status</th>
            <th className="p-4 font-semibold">Actions</th>
            <th className="p-4 font-semibold text-right">Embed</th>
          </tr>
        </thead>
        <tbody>
          {testimonials.map((t) => (
            <React.Fragment key={t._id}>
              <tr 
                className="border-b border-border/50 hover:bg-white/5 transition-colors cursor-pointer"
                onClick={() => setExpandedId(expandedId === t._id ? null : t._id)}
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {t.userDetails?.name?.charAt(0).toUpperCase() || "A"}
                    </div>
                    <div>
                      <p className="font-medium">{t.userDetails?.name || "Anonymous"}</p>
                      {t.userDetails?.designation && (
                        <p className="text-xs text-muted-foreground">{t.userDetails.designation}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-1 max-w-[200px]">
                    <div className="flex items-center gap-2 capitalize text-xs font-medium text-primary">
                      {getTypeIcon(t)}
                      {t.mediaType !== 'none' ? t.mediaType : 'Text Only'} 
                    </div>
                    {t.mediaType !== 'none' && t.mediaUrl && (
                        <div className="relative w-16 h-12 rounded-md overflow-hidden bg-black/20 border border-border mt-1">
                            {t.mediaType === 'video' ? (
                                <video src={t.mediaUrl} className="w-full h-full object-cover" />
                            ) : (
                                <img src={t.mediaUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                            )}
                        </div>
                    )}
                    {t.textContent ? (
                        <p className="text-xs text-muted-foreground line-clamp-2 italic">
                            {t.textContent}
                        </p>
                    ) : (
                        <p className="text-xs text-muted-foreground italic">No text content</p>
                    )}
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
                  <div className="flex flex-col gap-2">
                    {t.isApproved ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full w-fit">
                        <CheckCircle size={10} /> Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full w-fit">
                        <XCircle size={10} /> Pending
                      </span>
                    )}
                    {t.isArchived && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded-full w-fit">
                        <Archive size={10} /> Archived
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => handleAction(t._id, 'approve')}
                      disabled={actionLoading === t._id}
                      className={`p-2 rounded-lg transition-colors ${t.isApproved ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'bg-muted hover:bg-white/10 text-muted-foreground hover:text-white'}`}
                      title={t.isApproved ? "Unapprove" : "Approve"}
                    >
                      <CheckCircle size={16} />
                    </button>
                    <button
                      onClick={() => handleAction(t._id, 'archive')}
                      disabled={actionLoading === t._id}
                      className={`p-2 rounded-lg transition-colors ${t.isArchived ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20' : 'bg-muted hover:bg-white/10 text-muted-foreground hover:text-white'}`}
                      title={t.isArchived ? "Unarchive" : "Archive"}
                    >
                      <Archive size={16} />
                    </button>
                    <button
                      onClick={() => handleAction(t._id, 'delete')}
                      disabled={actionLoading === t._id}
                      className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
                <td className="p-4 text-right">
                  {t.isApproved ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyEmbed(t._id);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-medium bg-primary/20 hover:bg-primary/30 text-primary px-3 py-1.5 rounded-lg transition-colors"
                      title="Copy individual embed code"
                    >
                      {copiedId === t._id ? (
                        <><Check size={12} /> Copied!</>
                      ) : (
                        <><Code size={12} /> Embed</>
                      )}
                    </button>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">Approve to embed</span>
                  )}
                </td>
              </tr>
              {/* Expanded Content Row */}
              {expandedId === t._id && (
                <tr className="bg-muted/30">
                  <td colSpan={6} className="p-4">
                    <div className="space-y-6 max-w-5xl mx-auto">
                      <div className="flex flex-col gap-6">
                        {/* Always show media if it exists */}
                        {t.mediaType !== 'none' && t.mediaUrl && (
                          <div className="w-full">
                            <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Submitted Media:</p>
                            <div className="rounded-xl overflow-hidden border border-border bg-black/20">
                              {t.mediaType === 'video' ? (
                                <video src={t.mediaUrl} controls className="w-full max-h-[500px] object-contain" />
                              ) : (
                                <img src={t.mediaUrl} alt="Testimonial" className="w-full max-h-[500px] object-contain" />
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Always show text if it exists */}
                        {t.textContent && (
                          <div className="w-full">
                            <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Submitted Text:</p>
                            <div className="bg-background/50 p-6 rounded-xl border border-border shadow-inner">
                              <p className="italic text-xl leading-relaxed text-white/90">{t.textContent}</p>
                            </div>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-border/50">
                          <div className="space-y-1">
                                <p className="text-xs font-bold uppercase text-muted-foreground">User Details</p>
                                <p className="text-sm font-medium">{t.userDetails?.name || 'Anonymous'}</p>
                                <p className="text-xs text-muted-foreground">{t.userDetails?.email || 'No email'}</p>
                                <p className="text-xs text-muted-foreground">{t.userDetails?.designation || 'No designation'}</p>
                          </div>
                          <div className="space-y-1">
                                <p className="text-xs font-bold uppercase text-muted-foreground">Submission info</p>
                                <p className="text-sm">Rating: {t.rating}/5</p>
                                <p className="text-sm text-muted-foreground">Date: {formatDate(t.createdAt)}</p>
                          </div>
                          {t.isApproved && (
                            <div className="space-y-2">
                              <p className="text-xs font-bold uppercase text-muted-foreground">Individual Embed:</p>
                              <div className="bg-black/50 p-2 rounded-lg font-mono text-[10px] text-green-400 overflow-x-auto flex justify-between items-center group/code">
                                <code className="truncate max-w-[200px]">
                                  &lt;script src="{baseUrl}/embed.js" data-testimonial-id="{t._id}"&gt;&lt;/script&gt;
                                </code>
                                <button 
                                  onClick={() => handleCopyEmbed(t._id)}
                                  className="bg-primary/20 hover:bg-primary/30 p-1 rounded text-primary transition-all opacity-0 group-hover/code:opacity-100"
                                >
                                  <Copy size={12} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

