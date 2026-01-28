import React from 'react';

interface TestiSpaceEmbedProps {
    spaceId: string;
    baseUrl?: string;
    layout?: 'grid' | 'list' | 'carousel' | 'masonry';
    style?: 'modern' | 'minimal' | 'classic' | 'gradient';
}
declare const TestiSpaceEmbed: React.FC<TestiSpaceEmbedProps>;

interface Testimonial {
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
declare const useTestimonials: (spaceId: string, options?: {
    baseUrl?: string;
}) => {
    testimonials: Testimonial[];
    loading: boolean;
    error: Error | null;
};

export { type TestiSpaceEmbedProps, type Testimonial, TestiSpaceEmbed as default, useTestimonials };
