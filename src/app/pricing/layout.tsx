import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pricing | TestiSpace - Affordable Testimonial Software",
    description: "Simple, transparent pricing for TestiSpace. Start free with 3 video testimonials, upgrade to Pro for unlimited testimonials and custom branding. No credit card required.",
    keywords: ["testimonial software pricing", "video testimonial pricing", "social proof tool cost", "testimonial collection software"],
    openGraph: {
        title: "Pricing | TestiSpace",
        description: "Start for free, scale as you grow. No credit card required.",
        url: "https://testispace.com/pricing",
        type: "website",
    },
};

export default function PricingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
