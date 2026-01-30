"use client";

import { useEffect, useRef } from "react";
import { Star } from "lucide-react";

interface Testimonial {
  quote?: string;
  textContent?: string;
  name: string;
  designation: string;
  src?: string;
  avatar?: string;
  rating: number;
}

interface MarqueeTestimonialsProps {
  testimonials: Testimonial[];
  customStyles?: {
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
    starColor?: string;
    fontFamily?: string;
    borderRadius?: string;
    showImages?: boolean;
  };
}

export function MarqueeTestimonials({
  testimonials,
  customStyles = {},
}: MarqueeTestimonialsProps) {
  const {
    backgroundColor = "#1a1a1a",
    textColor = "#ffffff",
    accentColor = "#8b5cf6",
    starColor = "#eab308",
    fontFamily = "Inter",
    borderRadius = "12",
    showImages = true,
  } = customStyles;

  return (
    <div className="relative w-full py-12 overflow-hidden" style={{ fontFamily }}>
      <div className="marquee-container">
        <div className="marquee-content">
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <div
              key={index}
              className="inline-block mx-4 w-[350px] transform perspective-1000"
              style={{
                animation: `marquee 20s linear infinite`,
              }}
            >
              <div
                className="p-6 h-full flex flex-col transform transition-transform hover:scale-105 hover:-translate-y-2"
                style={{
                  backgroundColor,
                  borderRadius: `${borderRadius}px`,
                  boxShadow: `0 10px 40px ${accentColor}30`,
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < testimonial.rating ? starColor : "none"}
                      stroke={i < testimonial.rating ? starColor : textColor}
                    />
                  ))}
                </div>

                {/* Quote */}
                <p
                  className="text-sm leading-relaxed mb-6 flex-grow"
                  style={{ color: textColor }}
                >
                  "{testimonial.quote || testimonial.textContent}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  {showImages && (
                    <img
                      src={testimonial.src || testimonial.avatar}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover"
                      style={{ borderRadius: `${borderRadius}px` }}
                    />
                  )}
                  <div>
                    <div className="font-bold text-sm" style={{ color: textColor }}>
                      {testimonial.name}
                    </div>
                    <div className="text-xs opacity-70" style={{ color: textColor }}>
                      {testimonial.designation}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .marquee-container {
          overflow: hidden;
          white-space: nowrap;
        }
        .marquee-content {
          display: inline-block;
          animation: marquee 20s linear infinite;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}
