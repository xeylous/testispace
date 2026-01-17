"use client";
import { useState } from "react";
import { Star, CheckCircle, XCircle, Trash2, Eye, EyeOff } from "lucide-react";

export default function TestimonialCard({ testimonial }: { testimonial: any }) {
  const [isApproved, setIsApproved] = useState(testimonial.isApproved);
  const [isArchived, setIsArchived] = useState(testimonial.isArchived);
  const [deleted, setDeleted] = useState(false);

  const updateStatus = async (updates: any) => {
    try {
      const res = await fetch(`/api/testimonials/${testimonial._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        if (typeof updates.isApproved !== "undefined") setIsApproved(updates.isApproved);
        if (typeof updates.isArchived !== "undefined") setIsArchived(updates.isArchived);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to update");
    }
  };

  const deleteTestimonial = async () => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/testimonials/${testimonial._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleted(true);
      }
    } catch (e) {
      alert("Failed to delete");
    }
  };

  if (deleted) return null;

  return (
    <div className={`glass-card p-6 rounded-xl border border-border flex flex-col md:flex-row gap-6 transition-opacity ${isArchived ? "opacity-50" : "opacity-100"}`}>
        <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/10 px-2 py-1 rounded text-xs uppercase font-bold text-muted-foreground">
                    {testimonial.type}
                </span>
                <div className="flex text-yellow-500">
                    {Array(testimonial.rating).fill(0).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <span className="text-xs text-muted-foreground ml-auto">{new Date(testimonial.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="text-lg mb-4 text-white/90">
                {testimonial.content.startsWith('http') && (testimonial.type === 'video' || testimonial.type === 'image') ? (
                    testimonial.type === 'video' ? (
                        <video src={testimonial.content} controls className="w-full max-w-sm rounded-lg" />
                    ) : (
                        <img src={testimonial.content} alt="Testimonial" className="w-full max-w-sm rounded-lg" />
                    )
                ) : (
                    `"${testimonial.content}"`
                )}
            </p>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-white uppercase">
                    {testimonial.userDetails.name.charAt(0)}
                </div>
                <div>
                    <p className="font-medium text-sm">{testimonial.userDetails.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.userDetails.email}</p>
                </div>
            </div>
        </div>

        <div className="flex flex-row md:flex-col gap-2 md:border-l border-border md:pl-6 justify-center">
            <button 
                onClick={() => updateStatus({ isApproved: !isApproved })}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isApproved ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" : "bg-white/5 text-muted-foreground hover:bg-white/10"}`}
            >
                {isApproved ? <CheckCircle size={16} /> : <XCircle size={16} />}
                {isApproved ? "Approved" : "Approve"}
            </button>
            
            <button 
                onClick={() => updateStatus({ isArchived: !isArchived })}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-white/5 text-muted-foreground hover:bg-white/10 transition-colors"
            >
                {isArchived ? <Eye size={16} /> : <EyeOff size={16} />}
                {isArchived ? "Unarchive" : "Archive"}
            </button>

            <button 
                onClick={deleteTestimonial}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
            >
                <Trash2 size={16} />
                Delete
            </button>
        </div>
    </div>
  );
}
