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
  const [uploadProgress, setUploadProgress] = useState(0);

  // Cloudinary Upload Logic
  const uploadFile = async (file: File): Promise<string> => {
    const { timestamp, signature, cloudName, apiKey } = await fetch("/api/sign-cloudinary", {
        method: "POST"
    }).then(res => res.json());

    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", "testispace");

      const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${file.type.startsWith('video') ? 'video' : 'image'}/upload`;

      const xhr = new XMLHttpRequest();
      xhr.open("POST", endpoint);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          resolve(response.secure_url);
        } else {
          reject(new Error("Upload failed"));
        }
      };

      xhr.onerror = () => reject(new Error("Upload failed"));
      xhr.send(formData);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setUploadProgress(0);

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
      alert("Something went wrong during upload or submission");
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
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
                onChange={(e) => {
                  setFile(e.target.files?.[0] || null);
                  setUploadProgress(0);
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={submitting}
            />
            {file ? (
                <div className="flex flex-col items-center gap-2">
                    <div className="text-sm text-green-400 font-medium truncate max-w-xs">
                        {file.name}
                    </div>
                    {submitting && uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="relative w-12 h-12">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                          <path
                            className="text-gray-200 stroke-current"
                            strokeWidth="3"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="text-primary stroke-current"
                            strokeWidth="3"
                            strokeDasharray={`${uploadProgress}, 100`}
                            strokeLinecap="round"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <text x="18" y="20.35" className="text-[8px] font-bold" textAnchor="middle" fill="currentColor">{uploadProgress}%</text>
                        </svg>
                      </div>
                    )}
                    {submitting && uploadProgress === 100 && (
                      <div className="text-xs text-primary animate-pulse">Processing...</div>
                    )}
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
        {submitting ? (uploadProgress < 100 ? `Uploading (${uploadProgress}%)` : "Sending...") : "Submit Testimonial"}
      </button>
    </form>
  );
}

