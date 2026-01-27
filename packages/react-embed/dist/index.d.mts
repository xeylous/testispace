import React from 'react';

interface TestiSpaceEmbedProps {
    spaceId: string;
    baseUrl?: string;
    layout?: 'grid' | 'list' | 'carousel' | 'masonry';
    style?: 'modern' | 'minimal' | 'classic' | 'gradient';
}
declare const TestiSpaceEmbed: React.FC<TestiSpaceEmbedProps>;

export { type TestiSpaceEmbedProps, TestiSpaceEmbed as default };
