"use client";
import { useState, useEffect } from "react";
import { Star, Upload, Check } from "lucide-react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

export default function SubmissionForm({ spaceId }: { spaceId: string }) {
  const [rating, setRating] = useState(5);
  const [textContent, setTextContent] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
        setFile(selectedFile);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(URL.createObjectURL(selectedFile));
        setUploadProgress(0);
    }
  };

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
      let mediaType: 'none' | 'image' | 'video' = "none";

      if (file) {
        mediaUrl = await uploadFile(file);
        mediaType = file.type.startsWith("video") ? "video" : "image";
      }

      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spaceId,
          textContent: textContent.trim(),
          mediaUrl,
          mediaType,
          rating,
          name,
          email,
          designation,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ffffff']
        });
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
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-ring outline-none transition-all text-foreground min-h-[120px]"
          placeholder="Tell us what you liked..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Attach Media (Optional)</label>
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-white/5 transition-colors cursor-pointer relative overflow-hidden">
            <input 
                type="file" 
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={submitting}
            />
            {previewUrl ? (
                <div className="flex flex-col items-center gap-2">
                    <div className="relative w-full max-w-[200px] aspect-video rounded-lg overflow-hidden border border-border bg-black/40">
                         {file?.type.startsWith("video") ? (
                             <video src={previewUrl} className="w-full h-full object-cover" />
                         ) : (
                             <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                         )}
                         <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                             <span className="text-xs font-bold text-white bg-black/60 px-2 py-1 rounded">Change Media</span>
                         </div>
                    </div>
                    <div className="text-xs text-muted-foreground truncate max-w-xs">{file?.name}</div>
                    
                    {submitting && uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="relative w-10 h-10 mt-2">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="16" fill="none" className="stroke-muted" strokeWidth="3" />
                          <circle cx="18" cy="18" r="16" fill="none" className="stroke-primary" strokeWidth="3" strokeDasharray={`${uploadProgress}, 100`} strokeLinecap="round" />
                          <text x="18" y="22" className="text-[8px] font-bold" textAnchor="middle" fill="currentColor">{uploadProgress}%</text>
                        </svg>
                      </div>
                    )}
                </div>
            ) : (
                <div className="text-muted-foreground flex flex-col items-center gap-2">
                    <Upload size={24} />
                    <span>Click to upload image or video</span>
                </div>
            )}
            
            {submitting && uploadProgress === 100 && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20">
                    <div className="text-sm font-bold text-primary animate-pulse">Processing Media...</div>
                </div>
            )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium mb-2">Your Name</label>
                <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-input border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-ring outline-none transition-all text-foreground"
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
                className="w-full bg-input border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-ring outline-none transition-all text-foreground"
                placeholder="john@example.com"
                />
            </div>
        </div>
        <div>
            <label className="block text-sm font-medium mb-2">Job Title / Designation (Optional)</label>
            <input
            type="text"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            className="w-full bg-input border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-ring outline-none transition-all text-foreground"
            placeholder="e.g. CEO at Company"
            />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(139,92,246,0.5)] disabled:opacity-50"
      >
        {submitting ? (uploadProgress < 100 ? `Uploading (${uploadProgress}%)` : "Finalizing...") : "Submit Testimonial"}
      </button>
    </form>
  );
}

