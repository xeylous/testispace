import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Space from "@/models/Space";
import Testimonial from "@/models/Testimonial";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = params;
        const { name, headerTitle, customMessage } = await req.json();

        await connectDB();

        // @ts-ignore
        const space = await Space.findOne({ _id: id, ownerId: session.user.id });

        if (!space) {
            return NextResponse.json({ message: "Space not found" }, { status: 404 });
        }

        if (name) space.name = name;
        if (headerTitle) space.headerTitle = headerTitle;
        if (customMessage) space.customMessage = customMessage;

        await space.save();

        return NextResponse.json({ space }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = params;
        await connectDB();

        // @ts-ignore
        const space = await Space.findOne({ _id: id, ownerId: session.user.id });

        if (!space) {
            return NextResponse.json({ message: "Space not found" }, { status: 404 });
        }

        // Delete all testimonials associated with this space
        await Testimonial.deleteMany({ spaceId: id });

        // Delete the space
        await Space.deleteOne({ _id: id });

        return NextResponse.json({ message: "Space deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
