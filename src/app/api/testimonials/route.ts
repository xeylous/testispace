import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Testimonial from "@/models/Testimonial";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        let { spaceId, rating, name, email, designation, textContent, mediaUrl, mediaType } = body;

        // Resilience: fallback to legacy field name if new ones are missing
        if (!textContent && mediaType === 'none' && body.content) textContent = body.content;
        if (!mediaUrl && mediaType !== 'none' && body.content) mediaUrl = body.content;

        if (!spaceId || !rating || !name) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        await connectDB();

        const testimonial = await Testimonial.create({
            spaceId,
            textContent: textContent || "",
            mediaUrl: mediaUrl || "",
            mediaType: mediaType || 'none',
            rating,
            // Maintaing compatibility: type reflects the media if present, otherwise 'text'
            type: mediaType && mediaType !== 'none' ? mediaType : 'text',
            // content field stores media URL if media exists, otherwise textContent (legacy fallback)
            content: (mediaType && mediaType !== 'none' ? (mediaUrl || "") : (textContent || "")).trim(),
            userDetails: {
                name,
                email,
                designation,
            },
        });

        return NextResponse.json({ testimonial }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
