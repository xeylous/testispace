"use client";

import { Star } from "lucide-react";
import { AnimatedTestimonials } from "./ui/animated-testimonials";
import { MarqueeTestimonials } from "./ui/marquee-testimonials";
import { CardStackTestimonials } from "./ui/card-stack-testimonials";

interface EmbedPreviewProps {
  layout: string;
  cardStyle: string;
  customStyles: {
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    starColor: string;
    fontFamily: string;
    borderRadius: string;
    containerBackground?: string;
    showImages?: boolean;
  };
}

const mockTestimonials = [
  {
    name: "Sarah Johnson",
    designation: "Product Manager",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    rating: 5,
    textContent: "This product has completely transformed how our team collaborates. Highly recommend!",
    displaySettings: { showExperience: true, showImage: true, showName: true, showDesignation: true }
  },
  {
    name: "Michael Chen",
    designation: "Software Engineer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    rating: 5,
    textContent: "Amazing experience! The interface is intuitive and the features are exactly what we needed.",
    displaySettings: { showExperience: true, showImage: true, showName: true, showDesignation: true }
  },
  {
    name: "Emily Davis",
    designation: "Designer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    rating: 4,
    textContent: "Great tool for managing testimonials. The customization options are fantastic!",
    displaySettings: { showExperience: true, showImage: true, showName: true, showDesignation: true }
  }
];

export default function EmbedPreview({ layout, cardStyle, customStyles }: EmbedPreviewProps) {
  const globalShowImages = customStyles.showImages !== false; // Default to true

  const getCardStyle = () => {
    const baseStyle = {
      backgroundColor: customStyles.backgroundColor,
      color: customStyles.textColor,
      borderRadius: `${customStyles.borderRadius}px`,
      fontFamily: customStyles.fontFamily,
    };

    switch (cardStyle) {
      case 'modern':
        return {
          ...baseStyle,
          background: `linear-gradient(135deg, ${customStyles.backgroundColor}dd, ${customStyles.backgroundColor}cc)`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${customStyles.accentColor}40`,
          boxShadow: `0 8px 32px ${customStyles.accentColor}20`,
        };
      case 'minimal':
        return {
          ...baseStyle,
          border: `1px solid ${customStyles.textColor}20`,
          boxShadow: 'none',
        };
      case 'classic':
        return {
          ...baseStyle,
          border: `2px solid ${customStyles.accentColor}50`,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        };
      case 'gradient':
        return {
          ...baseStyle,
          background: `linear-gradient(135deg, ${customStyles.accentColor}40, ${customStyles.backgroundColor})`,
          border: 'none',
          boxShadow: `0 8px 16px ${customStyles.accentColor}30`,
        };
      default:
        return baseStyle;
    }
  };

  const getLayoutClass = () => {
    switch (layout) {
      case 'grid':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';
      case 'carousel':
        return 'flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory';
      case 'masonry':
        return 'columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4';
      case 'list':
        return 'flex flex-col gap-4';
      default:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';
    }
  };

  const cardStyles = getCardStyle();

  // Common container style
  const containerStyle = {
    background: customStyles.containerBackground || `${customStyles.backgroundColor}10`,
    fontFamily: customStyles.fontFamily 
  };

  const containerClassName = "p-6 rounded-lg transition-colors duration-300";

  // Special handling for animated layout
  if (layout === 'animated') {
    return (
      <div className={`${containerClassName} min-h-[500px]`} style={containerStyle}>
        <AnimatedTestimonials 
          testimonials={mockTestimonials}
          customStyles={customStyles}
        />
      </div>
    );
  }

  // Marquee layout
  if (layout === 'marquee') {
    return (
      <div className={`${containerClassName} min-h-[400px]`} style={containerStyle}>
        <MarqueeTestimonials 
          testimonials={mockTestimonials}
          customStyles={customStyles}
        />
      </div>
    );
  }

  // Card Stack layout
  if (layout === 'stack') {
    return (
      <div className={`${containerClassName} min-h-[500px]`} style={containerStyle}>
        <CardStackTestimonials 
          testimonials={mockTestimonials}
          customStyles={customStyles}
        />
      </div>
    );
  }

  return (
    <div className={containerClassName} style={containerStyle}>
      <div className={getLayoutClass()}>
        {mockTestimonials.map((testimonial, index) => {
          const showImage = globalShowImages && (testimonial.displaySettings?.showImage !== false);
          const showName = (testimonial.displaySettings?.showName !== false);
          const showDesignation = (testimonial.displaySettings?.showDesignation !== false);
          const showExperience = (testimonial.displaySettings?.showExperience !== false);

          return (
            <div
              key={index}
              className={`p-6 transition-all ${layout === 'carousel' ? 'min-w-[300px] snap-center' : ''}`}
              style={cardStyles}
            >
              <div className="flex items-center gap-3 mb-4">
                {showImage && (
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                {(showName || showDesignation) && (
                  <div>
                    {showName && (
                      <div className="font-bold" style={{ color: customStyles.textColor }}>
                        {testimonial.name}
                      </div>
                    )}
                    {showDesignation && (
                      <div className="text-sm opacity-70" style={{ color: customStyles.textColor }}>
                        {testimonial.designation}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} fill={customStyles.starColor} color={customStyles.starColor} />
                ))}
              </div>
              
              {showExperience && (
                <p className="text-sm leading-relaxed break-words whitespace-pre-wrap" style={{ color: customStyles.textColor }}>
                  {testimonial.textContent}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
