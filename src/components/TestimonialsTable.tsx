'use client'
import React, { useState, useMemo } from "react";
import { Star, Video, FileText, Image, Copy, Check, CheckCircle, XCircle, Code, Trash2, Archive, Share2, Filter, ChevronLeft, ChevronRight, Search } from "lucide-react";

interface DisplaySettings {
  showExperience: boolean;
  showImage: boolean;
  showName: boolean;
  showDesignation: boolean;
}

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
  displaySettings?: DisplaySettings;
  createdAt: string;
}

interface TestimonialsTableProps {
  testimonials: Testimonial[];
  baseUrl: string;
  spaceId: string;
  initialSelectedTestimonials?: string[];
  itemsPerPage?: number;
  showSelection?: boolean;
  showEmbedCode?: boolean;
}

export default function TestimonialsTable({ 
  testimonials: initialTestimonials, 
  baseUrl, 
  spaceId, 
  initialSelectedTestimonials = [],
  itemsPerPage = 10,
  showSelection = false,
  showEmbedCode = true
}: TestimonialsTableProps) {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedTestimonials);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Filtering and Pagination State
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'archived'>('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  const filteredTestimonials = useMemo(() => {
    let result = [...testimonials];

    // Filter by status
    if (filter === 'approved') result = result.filter(t => t.isApproved);
    if (filter === 'pending') result = result.filter(t => !t.isApproved && !t.isArchived);
    if (filter === 'archived') result = result.filter(t => t.isArchived);

    // Search
    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(t => 
        t.userDetails.name.toLowerCase().includes(lowerSearch) ||
        (t.textContent && t.textContent.toLowerCase().includes(lowerSearch))
      );
    }

    // Sort
    if (sortBy === 'newest') {
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    return result;
  }, [testimonials, filter, search, sortBy]);

  const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage);
  const currentTestimonials = filteredTestimonials.slice(
      (currentPage - 1) * itemsPerPage, 
      currentPage * itemsPerPage
  );

  const handleUpdateDisplaySettings = async (id: string, setting: keyof DisplaySettings, value: boolean) => {
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displaySettings: { [setting]: value }
        }),
      });

      if (res.ok) {
        setTestimonials(prev => prev.map(t => 
          t._id === id 
            ? { ...t, displaySettings: { ...t.displaySettings, [setting]: value } as any } 
            : t
        ));
      }
    } catch (err) {
      console.error("Display update failed:", err);
    }
  };

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

  const handleToggleSelect = async (id: string) => {
    const isSelected = selectedIds.includes(id);
    const newSelected = isSelected 
      ? selectedIds.filter(sid => sid !== id)
      : [...selectedIds, id];
    
    setSelectedIds(newSelected);

    try {
      const res = await fetch(`/api/spaces/${spaceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedTestimonials: newSelected }),
      });

      if (!res.ok) {
        setSelectedIds(selectedIds);
        alert("Failed to update selection");
      }
    } catch (err) {
      console.error("Selection update failed:", err);
      setSelectedIds(selectedIds);
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
        year: 'numeric', month: 'short', day: 'numeric',
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
    <div>
        {/* Filters and Controls */}
        <div className="p-4 border-b border-border flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                {showSelection && selectedIds.length > 0 && (
                    <div className="flex items-center gap-2">
                         <div className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium whitespace-nowrap border border-primary/20">
                            {selectedIds.length} Selected
                        </div>
                        <button
                            onClick={async () => {
                                if(!confirm(`Approve ${selectedIds.length} testimonials?`)) return;
                                try {
                                    await fetch('/api/testimonials/batch', {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ ids: selectedIds, action: 'approve', value: true })
                                    });
                                    setTestimonials(prev => prev.map(t => selectedIds.includes(t._id) ? { ...t, isApproved: true } : t));
                                    setSelectedIds([]);
                                } catch(e) { console.error(e); alert('Error'); }
                            }}
                            className="bg-green-500/20 text-green-600 hover:bg-green-500/30 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                        >
                            Approve
                        </button>
                        <button
                             onClick={async () => {
                                if(!confirm(`Archive ${selectedIds.length} testimonials?`)) return;
                                try {
                                    await fetch('/api/testimonials/batch', {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ ids: selectedIds, action: 'archive', value: true })
                                    });
                                    setTestimonials(prev => prev.map(t => selectedIds.includes(t._id) ? { ...t, isArchived: true } : t));
                                    setSelectedIds([]);
                                } catch(e) { console.error(e); alert('Error'); }
                            }}
                            className="bg-gray-500/20 text-gray-600 hover:bg-gray-500/30 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                        >
                            Archive
                        </button>
                    </div>
                )}
                {!showSelection && (
                    <div className="flex gap-2">
                        {(['all', 'approved', 'pending', 'archived'] as const).map(status => (
                            <button
                                key={status}
                                onClick={() => { setFilter(status); setCurrentPage(1); }}
                                className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
                                    filter === status 
                                        ? 'bg-primary text-primary-foreground font-medium' 
                                        : 'text-muted-foreground hover:bg-white/5'
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            
            <div className="flex gap-2 w-full md:w-auto items-center">
                 <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-background/50 border border-border rounded-lg pl-9 pr-3 py-1.5 text-sm w-full md:w-48 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                 </div>
                 <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                    className="bg-background/50 border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                 >
                     <option value="newest">Newest</option>
                     <option value="oldest">Oldest</option>
                 </select>
            </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
        <table className="w-full">
            <thead>
            <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                <th className="p-4 font-semibold">From</th>
                {showSelection && <th className="p-4 font-semibold text-center">Select</th>}
                <th className="p-4 font-semibold">Content Type</th>
                <th className="p-4 font-semibold">Rating</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Actions</th>
                {showEmbedCode && <th className="p-4 font-semibold text-right">Embed</th>}
            </tr>
            </thead>
            <tbody>
            {currentTestimonials.map((t) => (
                <React.Fragment key={t._id}>
                <tr 
                    className={`border-b transition-colors cursor-pointer ${
                        selectedIds.includes(t._id) 
                            ? 'bg-primary/5 border-primary/50' 
                            : 'border-border/50 hover:bg-white/5'
                    }`}
                    onClick={() => setExpandedId(expandedId === t._id ? null : t._id)}
                >
                    <td className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {t.userDetails?.name?.charAt(0).toUpperCase() || "A"}
                        </div>
                        <div>
                        <p className="font-medium">{t.userDetails?.name || "which will be best"}</p>
                        {t.userDetails?.designation && (
                            <p className="text-xs text-muted-foreground">{t.userDetails.designation}</p>
                        )}
                        </div>
                    </div>
                    </td>
                    {showSelection && (
                        <td className="p-4">
                            <div className="flex items-center justify-center" onClick={e => e.stopPropagation()}>
                                <input 
                                type="checkbox" 
                                checked={selectedIds.includes(t._id)}
                                onChange={() => handleToggleSelect(t._id)}
                                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary"
                                />
                            </div>
                        </td>
                    )}
                    <td className="p-4">
                    <div className="flex flex-col gap-1 max-w-[200px]">
                        <div className="flex items-center gap-2 capitalize text-xs font-medium text-primary">
                        {getTypeIcon(t)}
                        {t.mediaType !== 'none' ? t.mediaType : 'Text Only'} 
                        </div>
                        {t.textContent ? (
                            <p className="text-xs text-muted-foreground italic">
                                {t.textContent.length > 100 ? `${t.textContent.substring(0, 100)}...` : t.textContent}
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
                    {showEmbedCode && (
                        <td className="p-4 text-right">
                        {t.isApproved ? (
                            <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCopyEmbed(t._id);
                            }}
                            className="inline-flex items-center gap-1 text-xs font-medium bg-primary/20 hover:bg-primary/30 text-primary px-3 py-1.5 rounded-lg transition-colors"
                            title="Copy individual embed code (Single layout)"
                            >
                            {copiedId === t._id ? (
                                <><Check size={12} /> Copied!</>
                            ) : (
                                <><Code size={12} /> Single</>
                            )}
                            </button>
                        ) : (
                            <span className="text-xs text-muted-foreground italic">Approve to embed</span>
                        )}
                        </td>
                    )}
                </tr>
                {/* Expanded Content Row */}
                {expandedId === t._id && (
                    <tr className="bg-muted/30">
                    <td colSpan={showSelection ? (showEmbedCode ? 7 : 6) : (showEmbedCode ? 6 : 5)} className="p-4">
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

        {/* Pagination */}
        {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                    Showing  <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredTestimonials.length)}</span> of <span className="font-medium">{filteredTestimonials.length}</span> results
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-border hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-border hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        )}
    </div>
  );
}
