"use client";

import { useState, useEffect } from "react";
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

interface CardStackTestimonialsProps {
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
  interval?: number;
}

export function CardStackTestimonials({
  testimonials,
  customStyles = {},
  interval = 3000,
}: CardStackTestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const {
    backgroundColor = "#1a1a1a",
    textColor = "#ffffff",
    accentColor = "#8b5cf6",
    starColor = "#eab308",
    fontFamily = "Inter",
    borderRadius = "12",
    showImages = true,
  } = customStyles;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, interval);

    return () => clearInterval(timer);
  }, [testimonials.length, interval]);

  return (
    <div
      className="relative w-full max-w-2xl mx-auto px-4 py-12"
      style={{ fontFamily, minHeight: "400px" }}
    >
      <div className="relative h-[350px]">
        {testimonials.map((testimonial, index) => {
          const offset = (index - currentIndex + testimonials.length) % testimonials.length;
          const isActive = offset === 0;
          
          return (
            <div
              key={index}
              className="absolute inset-0 transition-all duration-500 cursor-pointer"
              style={{
                transform: `
                  translateY(${offset * 15}px) 
                  translateX(${offset * 10}px) 
                  scale(${1 - offset * 0.05})
                  rotateY(${offset * 2}deg)
                `,
                zIndex: testimonials.length - offset,
                opacity: offset < 3 ? 1 - offset * 0.3 : 0,
                pointerEvents: isActive ? "auto" : "none",
              }}
              onClick={() => setCurrentIndex(index)}
            >
              <div
                className="w-full h-full p-8 flex flex-col justify-between"
                style={{
                  backgroundColor,
                  borderRadius: `${borderRadius}px`,
                  boxShadow: `0 ${10 + offset * 5}px ${30 + offset * 10}px ${accentColor}${Math.max(20 - offset * 5, 10)}`,
                  border: `2px solid ${isActive ? accentColor : `${accentColor}30`}`,
                }}
              >
                {/* Quote */}
                <div>
                  <blockquote
                    className="text-lg md:text-xl font-medium leading-relaxed mb-6"
                    style={{ color: textColor }}
                  >
                    "{testimonial.quote || testimonial.textContent}"
                  </blockquote>

                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        fill={i < testimonial.rating ? starColor : "none"}
                        stroke={i < testimonial.rating ? starColor : textColor}
                      />
                    ))}
                  </div>
                </div>

                {/* Author */}
                <div className="flex items-center gap-4">
                  {showImages && (
                    <img
                      src={testimonial.src || testimonial.avatar}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover"
                      style={{ borderRadius: `${borderRadius}px` }}
                    />
                  )}
                  <div>
                    <div className="font-bold" style={{ color: textColor }}>
                      {testimonial.name}
                    </div>
                    <div className="text-sm opacity-70" style={{ color: textColor }}>
                      {testimonial.designation}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className="transition-all duration-300"
            style={{
              width: currentIndex === index ? "32px" : "8px",
              height: "8px",
              borderRadius: "4px",
              backgroundColor: currentIndex === index ? accentColor : `${textColor}30`,
            }}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
