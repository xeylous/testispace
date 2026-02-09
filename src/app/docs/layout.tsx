import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Documentation | TestiSpace - Setup Guide & Architecture",
    description: "Learn how to set up and integrate TestiSpace. Explore the technical architecture, tech stack, and step-by-step setup guide for collecting and embedding testimonials.",
    keywords: ["testimonial API documentation", "embed testimonials guide", "TestiSpace setup", "testimonial integration"],
    openGraph: {
        title: "Documentation | TestiSpace",
        description: "Technical docs, architecture, and setup guide for TestiSpace.",
        url: "https://testispace.vercel.app/docs",
        type: "website",
    },
};

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
