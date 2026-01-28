"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => index_default,
  useTestimonials: () => useTestimonials
});
module.exports = __toCommonJS(index_exports);
var import_react = __toESM(require("react"));
var TestiSpaceEmbed = ({
  spaceId,
  baseUrl = "https://testispace.vercel.app",
  layout,
  style
}) => {
  const containerRef = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
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
  return /* @__PURE__ */ import_react.default.createElement("div", { ref: containerRef, className: "testispace-wrapper" });
};
var index_default = TestiSpaceEmbed;
var useTestimonials = (spaceId, options) => {
  const [testimonials, setTestimonials] = (0, import_react.useState)([]);
  const [loading, setLoading] = (0, import_react.useState)(true);
  const [error, setError] = (0, import_react.useState)(null);
  const baseUrl = (options == null ? void 0 : options.baseUrl) || "https://testispace.vercel.app";
  (0, import_react.useEffect)(() => {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useTestimonials
});
