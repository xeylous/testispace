"use client";

import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  quote?: string;
  textContent?: string;
  name: string;
  designation: string;
  src?: string;
  avatar?: string;
  rating: number;
  displaySettings?: {
    showExperience: boolean;
    showImage: boolean;
    showName: boolean;
    showDesignation: boolean;
  };
}

interface AnimatedTestimonialsProps {
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
  autoplayInterval?: number;
}

export function AnimatedTestimonials({
  testimonials,
  customStyles = {},
  autoplayInterval = 3000,
}: AnimatedTestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const {
    backgroundColor = "#1a1a1a",
    textColor = "#ffffff",
    accentColor = "#8b5cf6",
    starColor = "#eab308",
    fontFamily = "Inter",
    borderRadius = "12",
    showImages: globalShowImages = true,
  } = customStyles;

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, autoplayInterval);

    return () => clearInterval(timer);
  }, [currentIndex, autoplayInterval]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handlePrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  const currentTestimonial = testimonials[currentIndex];
  
  // Per-testimonial display settings
  const showImage = globalShowImages && (currentTestimonial.displaySettings?.showImage !== false);
  const showName = currentTestimonial.displaySettings?.showName !== false;
  const showDesignation = currentTestimonial.displaySettings?.showDesignation !== false;
  const showExperience = currentTestimonial.displaySettings?.showExperience !== false;

  return (
    <div
      className="relative w-full max-w-5xl mx-auto px-4 py-12"
      style={{ fontFamily }}
    >
      <div className="relative">
        {/* Main Card */}
        <div
          className="relative overflow-hidden transition-all duration-500"
          style={{
            backgroundColor,
            borderRadius: `${borderRadius}px`,
            boxShadow: `0 20px 60px ${accentColor}30`,
          }}
        >
          {/* Content */}
          <div className={`grid ${showImage ? "md:grid-cols-2" : "grid-cols-1"} gap-8 p-8 md:p-12`}>
            {/* Image Section */}
            {showImage && (
              <div className="flex items-center justify-center">
                <div
                  className={`relative transition-all duration-500 ${
                    isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
                  }`}
                >
                  <div
                    className="absolute inset-0 blur-3xl opacity-30"
                    style={{
                      background: `linear-gradient(135deg, ${accentColor}, ${backgroundColor})`,
                    }}
                  />
                  <img
                    src={currentTestimonial.src || currentTestimonial.avatar}
                    alt={currentTestimonial.name}
                    className="relative w-64 h-64 object-cover rounded-2xl shadow-2xl"
                    style={{ borderRadius: `${borderRadius}px` }}
                  />
                </div>
              </div>
            )}

            {/* Text Section */}
            <div
              className={`flex flex-col justify-center transition-all duration-500 ${
                isAnimating
                  ? "opacity-0 translate-x-8"
                  : "opacity-100 translate-x-0"
              } ${!showImage && "text-center items-center max-w-2xl mx-auto"}`}
            >
              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    fill={i < currentTestimonial.rating ? starColor : "none"}
                    stroke={i < currentTestimonial.rating ? starColor : textColor}
                    className="transition-colors"
                  />
                ))}
              </div>

              {/* Quote */}
              {showExperience && (
                <blockquote
                  className={`${showImage ? "text-xl md:text-2xl" : "text-2xl md:text-3xl"} font-medium leading-relaxed mb-8 break-words whitespace-pre-wrap`}
                  style={{ color: textColor }}
                >
                  "{currentTestimonial.quote || currentTestimonial.textContent}"
                </blockquote>
              )}

              {/* Author */}
              <div className={!showImage ? "text-center" : ""}>
                {showName && (
                  <div
                    className="text-lg font-bold mb-1"
                    style={{ color: textColor }}
                  >
                    {currentTestimonial.name}
                  </div>
                )}
                {showDesignation && (
                  <div
                    className="text-sm opacity-70"
                    style={{ color: textColor }}
                  >
                    {currentTestimonial.designation}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={isAnimating}
              className="p-3 rounded-full transition-all hover:scale-110 disabled:opacity-50"
              style={{
                backgroundColor: `${accentColor}20`,
                color: textColor,
              }}
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Dots Indicator */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (!isAnimating) {
                      setIsAnimating(true);
                      setCurrentIndex(index);
                      setTimeout(() => setIsAnimating(false), 500);
                    }
                  }}
                  className="transition-all duration-300"
                  style={{
                    width: currentIndex === index ? "32px" : "8px",
                    height: "8px",
                    borderRadius: "4px",
                    backgroundColor:
                      currentIndex === index
                        ? accentColor
                        : `${textColor}30`,
                  }}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={isAnimating}
              className="p-3 rounded-full transition-all hover:scale-110 disabled:opacity-50"
              style={{
                backgroundColor: `${accentColor}20`,
                color: textColor,
              }}
              aria-label="Next testimonial"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
