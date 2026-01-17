import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Testimonial from "@/models/Testimonial";

export async function POST(req: Request) {
    try {
        const { spaceId, type, content, rating, name, email } = await req.json();

        if (!spaceId || !content || !rating || !name) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        await connectDB();

        const testimonial = await Testimonial.create({
            spaceId,
            type,
            content,
            rating,
            userDetails: {
                name,
                email,
            },
        });

        return NextResponse.json({ testimonial }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
