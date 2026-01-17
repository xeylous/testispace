import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Space from "@/models/Space";
import { v4 as uuidv4 } from "uuid";

const slugify = (text: string) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { name, headerTitle, customMessage } = await req.json();

        if (!name) {
            return NextResponse.json({ message: "Name is required" }, { status: 400 });
        }

        await connectDB();

        // Generate unique slug
        let slug = slugify(name);
        // Append random string to ensure uniqueness
        const randomSuffix = uuidv4().slice(0, 6);
        slug = `${slug}-${randomSuffix}`;

        const space = await Space.create({
            // @ts-ignore
            ownerId: session.user.id,
            name,
            slug,
            headerTitle,
            customMessage
        });

        return NextResponse.json({ space }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
