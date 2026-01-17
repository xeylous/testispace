"use client";
import { useState } from "react";
import { Star, Upload, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function SubmissionForm({ spaceId }: { spaceId: string }) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Cloudinary Upload Logic
  const uploadFile = async (file: File) => {
    const { timestamp, signature, cloudName, apiKey } = await fetch("/api/sign-cloudinary", {
        method: "POST"
    }).then(res => res.json());

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);
    formData.append("folder", "testispace");

    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${file.type.startsWith('video') ? 'video' : 'image'}/upload`;

    const res = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let mediaUrl = "";
      let type = "text";

      if (file) {
        mediaUrl = await uploadFile(file);
        type = file.type.startsWith("video") ? "video" : "image";
      }

      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spaceId,
          type,
          content: type === "text" ? content : mediaUrl,
          rating,
          name,
          email,
        }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        alert("Failed to submit testimonial");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
        <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                <Check size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Thank you!</h3>
            <p className="text-muted-foreground">Your testimonial has been submitted successfully.</p>
        </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`transition-colors ${star <= rating ? "text-yellow-400" : "text-gray-600"}`}
            >
              <Star size={32} fill={star <= rating ? "currentColor" : "none"} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Your Experience</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-ring outline-none transition-all text-white min-h-[120px]"
          placeholder="Tell us what you liked..."
          required={!file}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Attach Media (Optional)</label>
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-white/5 transition-colors cursor-pointer relative">
            <input 
                type="file" 
                accept="image/*,video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {file ? (
                <div className="text-sm text-green-400 font-medium">
                    {file.name}
                </div>
            ) : (
                <div className="text-muted-foreground flex flex-col items-center gap-2">
                    <Upload size={24} />
                    <span>Click to upload image or video</span>
                </div>
            )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
            <label className="block text-sm font-medium mb-2">Your Name</label>
            <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-input border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-ring outline-none transition-all text-white"
            placeholder="John Doe"
            required
            />
        </div>
        <div>
            <label className="block text-sm font-medium mb-2">Email (Optional)</label>
            <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-input border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-ring outline-none transition-all text-white"
            placeholder="john@example.com"
            />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(139,92,246,0.5)] disabled:opacity-50"
      >
        {submitting ? "Sending..." : "Submit Testimonial"}
      </button>
    </form>
  );
}
