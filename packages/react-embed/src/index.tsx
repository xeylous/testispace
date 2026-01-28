import React, { useEffect, useRef, useState } from 'react';

export interface TestiSpaceEmbedProps {
  spaceId: string;
  baseUrl?: string;
  layout?: 'grid' | 'list' | 'carousel' | 'masonry';
  style?: 'modern' | 'minimal' | 'classic' | 'gradient';
}

const TestiSpaceEmbed: React.FC<TestiSpaceEmbedProps> = ({ 
  spaceId, 
  baseUrl = "https://testispace.vercel.app", 
  layout, 
  style 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous content
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = `${baseUrl}/embed.js`;
    script.setAttribute('data-space-id', spaceId);
    if (layout) script.setAttribute('data-layout', layout);
    if (style) script.setAttribute('data-style', style);
    script.async = true;

    // embed.js inserts the widget BEFORE the script tag
    // So we append script to our container, and the widget will be siblings inside the container (or before it?)
    // Actually, embed.js does: currentScript.parentNode.insertBefore(container, currentScript);
    // So if I append script to containerRef, containerRef is the parent.
    // The widget will be inserted into containerRef, before the script.
    // Perfect.
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [spaceId, baseUrl, layout, style]);

  return <div ref={containerRef} className="testispace-wrapper" />;
};

export default TestiSpaceEmbed;

export interface Testimonial {
  _id: string;
  content: string;
  rating: number;
  userDetails: {
    name: string;
    designation?: string;
    avatar?: string;
  };
  type: 'text' | 'video' | 'image';
  mediaUrl?: string;
  mediaType?: string;
  [key: string]: any;
}

export const useTestimonials = (spaceId: string, options?: { baseUrl?: string }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const baseUrl = options?.baseUrl || "https://testispace.vercel.app";

  useEffect(() => {
    if (!spaceId) return;

    setLoading(true);
    fetch(`${baseUrl}/api/embed/${spaceId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch testimonials');
        return res.json();
      })
      .then(data => {
        setTestimonials(data.testimonials || (Array.isArray(data) ? data : []));
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching testimonials:', err);
        setError(err);
        setLoading(false);
      });
  }, [spaceId, baseUrl]);

  return { testimonials, loading, error };
};
