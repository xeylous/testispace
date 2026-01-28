// src/index.tsx
import React, { useEffect, useRef, useState } from "react";
var TestiSpaceEmbed = ({
  spaceId,
  baseUrl = "https://testispace.vercel.app",
  layout,
  style
}) => {
  const containerRef = useRef(null);
  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";
    const script = document.createElement("script");
    script.src = `${baseUrl}/embed.js`;
    script.setAttribute("data-space-id", spaceId);
    if (layout) script.setAttribute("data-layout", layout);
    if (style) script.setAttribute("data-style", style);
    script.async = true;
    containerRef.current.appendChild(script);
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [spaceId, baseUrl, layout, style]);
  return /* @__PURE__ */ React.createElement("div", { ref: containerRef, className: "testispace-wrapper" });
};
var index_default = TestiSpaceEmbed;
var useTestimonials = (spaceId, options) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseUrl = (options == null ? void 0 : options.baseUrl) || "https://testispace.vercel.app";
  useEffect(() => {
    if (!spaceId) return;
    setLoading(true);
    fetch(`${baseUrl}/api/embed/${spaceId}`).then((res) => {
      if (!res.ok) throw new Error("Failed to fetch testimonials");
      return res.json();
    }).then((data) => {
      setTestimonials(data.testimonials || (Array.isArray(data) ? data : []));
      setLoading(false);
    }).catch((err) => {
      console.error("Error fetching testimonials:", err);
      setError(err);
      setLoading(false);
    });
  }, [spaceId, baseUrl]);
  return { testimonials, loading, error };
};
export {
  index_default as default,
  useTestimonials
};
