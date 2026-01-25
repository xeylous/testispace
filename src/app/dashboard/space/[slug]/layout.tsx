import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Space from "@/models/Space";
import { LayoutGrid, Heart, Settings } from "lucide-react";
import SpaceNav from "@/components/SpaceNav"; // We'll Create this client component for active states

async function getSpace(slug: string) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return null;

    await connectDB();
    // @ts-ignore
    const space = await Space.findOne({ slug, ownerId: session.user.id }).select("name slug");
    return space;
}

export default async function SpaceLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const space = await getSpace(slug);

    if (!space) return notFound();

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                            {space.name}
                        </h1>
                        <a 
                            href={`/${space.slug}`} 
                            target="_blank" 
                            className="text-muted-foreground hover:text-accent flex items-center gap-1 text-sm transition-colors"
                        >
                            Public Link: <span className="underline">/{space.slug}</span>
                        </a>
                    </div>
                </div>

                {/* Tab Navigation */}
                <SpaceNav slug={slug} />
            </div>

            {children}
        </div>
    );
}
