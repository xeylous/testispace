import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Testimonial from "@/models/Testimonial";
import Space from "@/models/Space";

export async function PATCH(req: Request, { params }: { params: any }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { isApproved, isArchived } = await req.json();

    await connectDB();

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
        return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    // Verify ownership
    // @ts-ignore
    const space = await Space.findOne({ _id: testimonial.spaceId, ownerId: session.user.id });
    if (!space) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (typeof isApproved !== "undefined") testimonial.isApproved = isApproved;
    if (typeof isArchived !== "undefined") testimonial.isArchived = isArchived;

    await testimonial.save();

    return NextResponse.json({ testimonial });
}

export async function DELETE(req: Request, { params }: { params: any }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await connectDB();

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
        return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    // Verify ownership
    // @ts-ignore
    const space = await Space.findOne({ _id: testimonial.spaceId, ownerId: session.user.id });
    if (!space) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await Testimonial.deleteOne({ _id: id });

    return NextResponse.json({ message: "Deleted" });
}
