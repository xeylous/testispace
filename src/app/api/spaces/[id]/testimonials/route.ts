import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Testimonial from "@/models/Testimonial";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await connectDB();

        const testimonials = await Testimonial.find({
            spaceId: id,
            isApproved: true,
            isArchived: false
        }).sort({ createdAt: -1 }).lean();

        // Standardized mapping
        const mappedTestimonials = testimonials.map((t: any) => {
            const rawMediaType = t.mediaType || t.type;
            const isMedia = rawMediaType === 'image' || rawMediaType === 'video';

            return {
                _id: t._id.toString(),
                textContent: t.textContent || (!isMedia ? t.content : ""),
                mediaUrl: t.mediaUrl || (isMedia ? t.content : ""),
                mediaType: isMedia ? rawMediaType : 'none',
                rating: t.rating || 5,
                displaySettings: t.displaySettings || {
                    showExperience: true,
                    showImage: true,
                    showName: true,
                    showDesignation: true
                },
                userDetails: {
                    name: t.userDetails?.name || "Anonymous",
                    designation: t.userDetails?.designation || "",
                    avatar: t.userDetails?.avatar || "",
                },
                // Flattening for convenience in custom integrations
                name: t.userDetails?.name || "Anonymous",
                designation: t.userDetails?.designation || "",
                avatar: t.userDetails?.avatar || "",
                createdAt: t.createdAt
            };
        });

        return NextResponse.json({ testimonials: mappedTestimonials }, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
            }
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
        }
    });
}
