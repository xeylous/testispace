import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Features | TestiSpace - Collect Video & Text Testimonials",
    description: "Explore TestiSpace features: video and text testimonial collection, beautiful embeds, moderation tools, theme customization, and lightning-fast performance with Redis caching.",
    keywords: ["testimonial features", "video testimonials", "embed testimonials", "testimonial moderation", "social proof widget", "testimonial collection tool"],
    openGraph: {
        title: "Features | TestiSpace",
        description: "Everything you need to collect, manage, and showcase testimonials that convert.",
        url: "https://testispace.vercel.app/features",
        type: "website",
    },
};

export default function FeaturesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
