// src/index.tsx
import React, { useEffect, useRef } from "react";
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
export {
  index_default as default
};
